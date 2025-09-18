

const { POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, baseUrl } = process.env;

if (!POSTMAN_API_KEY || !POSTMAN_WORKSPACE_ID || !baseUrl) {
  console.error("Please set POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, and baseUrl in environment variables.");
  process.exit(1);
}

async function getCollections() {
  const url = `${baseUrl}/collections?workspace=${POSTMAN_WORKSPACE_ID}`;
  const res = await fetch(url, {
    headers: { "X-Api-Key": POSTMAN_API_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch collections: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.collections || [];
}

async function getCollectionDetails(uid) {
  const url = `${baseUrl}/collections/${uid}`;
  const res = await fetch(url, {
    headers: { "X-Api-Key": POSTMAN_API_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch collection ${uid}: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.collection || {};
}

function checkFolders(items, parent = "") {
  const results = [];
  for (const item of items) {
    if (item.item && Array.isArray(item.item)) {
      const folderName = parent ? `${parent}/${item.name}` : item.name;
      if (item.item.length > 1) {
        results.push({ folderName, count: item.item.length });
      }
      // recurse deeper (nested folders possible)
      results.push(...checkFolders(item.item, folderName));
    }
  }
  return results;
}

async function main() {
  try {
    const collections = await getCollections();
    console.log(`Found ${collections.length} collections.`);

    for (const col of collections) {
      const details = await getCollectionDetails(col.uid);
      const foldersWithManyItems = checkFolders(details.item);

      if (foldersWithManyItems.length > 0) {
        console.log(`\nCollection: ${details.info.name}`);
        for (const f of foldersWithManyItems) {
          console.log(`  Folder: "${f.folderName}" has ${f.count} items`);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

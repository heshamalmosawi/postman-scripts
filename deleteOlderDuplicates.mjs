
const api_key = process.env.POSTMAN_API_KEY;
const workspaceId = process.env.POSTMAN_WORKSPACE_ID;
const baseUrl = process.env.baseUrl || "https://api.postman.com";

if (!api_key || !workspaceId) {
  throw new Error("Env variables POSTMAN_API_KEY and POSTMAN_WORKSPACE_ID are required");
}

async function getCollections() {
  const url = `${baseUrl}/collections?workspace=${workspaceId}`;
  const res = await fetch(url, {
    headers: { "x-api-key": api_key }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.collections;
}

async function deleteCollection(uid) {
  const url = `${baseUrl}/collections/${uid}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "x-api-key": api_key }
  });

  if (!res.ok) {
    console.error(`❌ Failed to delete collection ${uid}: ${res.status} ${res.statusText}`);
  } else {
    console.log(`🗑️ Deleted collection ${uid}`);
  }
}

async function main() {
  const collections = await getCollections();
    console.log(`Found ${collections.length} collections in workspace.`);

  // Group by name
  const grouped = collections.reduce((map, col) => {
    if (!map[col.name]) map[col.name] = [];
    map[col.name].push(col);
    return map;
  }, {});

  console.log(`Found ${collections.length - Object.keys(grouped).length} duplicate collections.`);

  for (const [name, cols] of Object.entries(grouped)) {
    if (cols.length > 1) {
      console.log(`Found duplicates for "${name}"`);

      // Sort by updatedAt, keep the newest
      cols.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const [keep, ...toDelete] = cols;

      console.log(`✅ Keeping: ${keep.uid} (updatedAt: ${keep.updatedAt})`);

      for (const col of toDelete) {
        await deleteCollection(col.uid);
      }
    }
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

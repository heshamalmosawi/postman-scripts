const { POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, baseUrl } = process.env;

if (!POSTMAN_API_KEY || !POSTMAN_WORKSPACE_ID || !baseUrl) {
    console.error("Please set POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, and baseUrl in environment variables.");
    process.exit(1);
}

const searchString = process.argv[2];
if (!searchString) {
    console.error("Please provide a search string as a command-line argument.");
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

async function deleteCollection(uid) {
    const url = `${baseUrl}/collections/${uid}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "X-Api-Key": POSTMAN_API_KEY },
    });
    if (!res.ok) throw new Error(`Failed to delete collection ${uid}: ${res.status} ${res.statusText}`);
    console.log(`Deleted collection ${uid}`);
}

async function main() {
    try {
        const collections = await getCollections();
        console.log(`Found ${collections.length} collections in workspace.`);

        if (collections.length === 0) {
            console.log("No collections to delete.");
            return;
        }

        const matchingCollections = collections.filter((col) => col.name.includes(searchString));
        console.log(`Found ${matchingCollections.length} matching collections.`);

        for (const col of matchingCollections) {
            console.log(`Deleting: ${col.name} (${col.uid})`);
            await deleteCollection(col.uid);
        }

        console.log("Matching collections deleted successfully.");
    } catch (err) {
        console.error("Error:", err.message);
    }
}

main();

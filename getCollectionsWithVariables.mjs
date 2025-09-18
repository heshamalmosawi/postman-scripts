const api_key = process.env.POSTMAN_API_KEY;
const workspaceId = process.env.POSTMAN_WORKSPACE_ID;
const baseUrl = process.env.baseUrl || "https://api.postman.com";

if (!api_key || !workspaceId || !baseUrl) {
    throw new Error("Env variables not found. Please set POSTMAN_API_KEY, POSTMAN_WORKSPACE_ID, and baseUrl");
}

const listCollectionsUrl = `${baseUrl}/collections?workspace=${workspaceId}`;

async function main() {
    try {
        // 🔹 Step 1: Get all collections
        const res = await fetch(listCollectionsUrl, {
            headers: { "x-api-key": api_key },
        });
        if (!res.ok) throw new Error(`Failed to fetch collections: ${res.status} ${res.statusText}`);

        const data = await res.json();
        const collections = data.collections;
        if (!collections || collections.length === 0) {
            console.log("No collections found.");
            return;
        }

        console.log(`Found ${collections.length} collections. Checking for collection-level variables...`);

        // 🔹 Step 2: For each collection, fetch details and inspect variables
        for (const col of collections) {
            const colUrl = `${baseUrl}/collections/${col.id}`;
            const colRes = await fetch(colUrl, {
                headers: { "x-api-key": api_key },
            });
            if (!colRes.ok) {
                console.error(`Failed to fetch collection ${col.id}: ${colRes.statusText}`);
                continue;
            }

            const colData = await colRes.json();
            const variables = colData.collection?.variable || [];

            if (variables.length > 0) {
                console.log(`\n📦 Collection: ${col.name} (${col.id})`);
                console.log("Variables:");
                variables.forEach((v) =>
                    console.log(`  - ${v.key} = ${v.value ?? "(no value)"}`)
                );
            }
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

main();

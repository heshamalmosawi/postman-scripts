import fs from 'fs';

const readCollectionFromFile = () => {
    const data = fs.readFileSync('test.postman_collection.json', 'utf8');
    return JSON.parse(data);
}

const addResponseToRequest = async (collectionJSON, requestName) => {
    const request = collectionJSON.item.find(item => item.name === requestName);
    if (request) {
        if (!request.response) {
            request.response = [];
        }

        const newResponse = {
            id: `response_${Date.now()}`,
            name: request.name,
            originalRequest: { ...request.request },
            status: "OK",
            code: 200,
            _postman_previewlanguage: "json",
            header: [
                { key: "Content-Type", value: "application/json" },
                { key: "Custom-Header", value: "CustomValue" }
            ],
            body: JSON.stringify({ message: "This is a sample response with headers and body" }, null, 2)
        };

        request.response.push(newResponse);
        console.log(`Response added to request: ${requestName}`);
    } else {
        console.log(`Request with name "${requestName}" not found.`);
    }
}

const main = async () => {
    const collection = readCollectionFromFile();
    await addResponseToRequest(collection, 'test');

    fs.writeFileSync(
        'test_updated.postman_collection.json',
        JSON.stringify(collection, null, 2),
        'utf8'
    );
    console.log('Updated collection saved to test_updated.postman_collection.json');
}

main();
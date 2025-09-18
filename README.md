# Postman Scripts

A collection of Node.js scripts to automate and manage Postman collections via the Postman API and local files. These utilities help you perform bulk operations, inspect collection structure, and manipulate collection files for advanced workflows.

## Features

- **addResponseToRequest.mjs**: Adds a sample response to a specific request in a local Postman collection JSON file.
- **deleteAllCollections.mjs**: Deletes all collections in a given Postman workspace using the Postman API.
- **getCollectionsWithVariables.mjs**: Lists all collections in a workspace and displays their collection-level variables.
- **listAllFolders.mjs**: Lists all folders (and subfolders) in each collection, highlighting folders with multiple items.

## Requirements

- Node.js v18 or higher
- Access to the [Postman API](https://www.postman.com/postman/workspace/postman-public-workspace/overview)
- Postman API Key and Workspace ID (for scripts interacting with the API)

## Installation

**Clone the repository:**
   ```bash
   git clone https://github.com/heshamalmosawi/postman-scripts.git
   cd postman-scripts
   ```

## Usage

### Environment Variables
For scripts that interact with the Postman API, set the following environment variables:
- `POSTMAN_API_KEY`: Your Postman API key
- `POSTMAN_WORKSPACE_ID`: The workspace ID to operate on
- `baseUrl`: (Optional) Override the Postman API base URL (default: `https://api.postman.com`)

You can set these in your shell or in a `.env` file.

### Running Scripts
Run any script with:
```bash
node <script.mjs>
```
If you use a `.env` file for environment variables, use:
```bash
node --env-file=.env <script.mjs>
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
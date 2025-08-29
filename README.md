# MCP Demo Server

A complete **Model Context Protocol (MCP)** demo server — modular, extensible, and ready to be used as a local development reference or a foundation for production builds.

> **Note:** This repository is a demo implementation: tools and resources include mocks and examples. When integrating with real services, replace mock implementations with real API calls and secure configuration.

---

## Features

* 🛠️ **Tools**

  * **API Tool** — fetch or mock external API data (weather, news, quotes)
  * **Math Tool** — run arithmetic and higher-level math operations
  * **Database Tool** — query a mock database for user data and analytics

* 📊 **Resources**

  * **System Logs** — structured JSON logs and error reports for debugging
  * **User Profiles** — sample user profile data and preferences

* 💬 **Prompts**

  * **Data Analysis** — build structured data analysis prompts
  * **Report Generation** — create report templates and rendering helpers
  * **System Troubleshooting** — guided troubleshooting prompts and steps

* ✅ Input validation, structured errors, JSON logging, and extensible plugin model.

---

## Quick Start

### 1. Installation

```bash
# Create project folder and install dependencies
mkdir mcp-demo-server
cd mcp-demo-server
# Copy files from the artifact into this folder
npm install
```

### 2. Configuration

```bash
# Copy env template
cp .env.example .env
# Edit .env for your environment and API keys
nano .env
```

Environment variables supported (defaults in `.env.example`):

* `PORT` — server port (default `3000`)
* `LOG_LEVEL` — `info|debug|warn|error`
* `NODE_ENV` — `development|production`
* `WEATHER_API_KEY` — optional external API key
* `DATABASE_PATH` — path to SQLite (or other DB) when enabled
* `LOGS_PATH` — path to logs JSON file
* `PROFILES_PATH` — path to profiles JSON file

### 3. Run the Server

```bash
# Start server
npm start
# Development mode (auto-restart)
npm run dev
```

### 4. Test with Example Client

```bash
# Run example tests / client
npm test
```

---

## Project Structure

```
mcp-demo-server/
├── src/
│   ├── server.js          # Main MCP server bootstrap and routing
│   ├── tools/             # Tool implementations (api-tool, math-tool, db-tool)
│   ├── resources/         # Resource implementations (logs, profiles)
│   ├── prompts/           # Prompt templates and generators
│   └── utils/             # Utilities (logger, config, validators)
├── data/                  # Sample data files (mock DB, profiles, logs)
├── tests/                 # Unit/integration test files and example clients
├── .env.example           # Example environment variables
├── package.json           # Node dependencies and scripts
└── README.md              # This file
```

---

## Usage Examples

### Calling Tools (example client snippets)

```javascript
// Math calculations
await client.callTool({
  name: 'calculate_math',
  arguments: { operation: 'add', numbers: [10, 20, 30] }
});

// API data fetching (mocked or real if configured)
await client.callTool({
  name: 'fetch_api_data',
  arguments: { endpoint: 'weather', params: { city: 'Tokyo' } }
});

// Database queries
await client.callTool({
  name: 'query_database',
  arguments: { query_type: 'select', table: 'users', limit: 5 }
});
```

### Reading Resources

```javascript
const logs = await client.readResource({ uri: 'logs://system' });
const profiles = await client.readResource({ uri: 'profiles://users' });
```

### Generating Prompts

```javascript
const prompt = await client.getPrompt({
  name: 'analyze_data',
  arguments: { data_source: 'logs', analysis_type: 'summary' }
});
```

---

## Extending the Server

### Add a New Tool

1. Create a new file in `src/tools/` (e.g., `my-tool.js`).
2. Export a tool object with the following shape:

```javascript
export const myTool = {
  name: 'my_custom_tool',
  description: 'Does something useful',
  inputSchema: { /* JSON Schema */ },
  async execute(args) { /* return { success: boolean, data } */ }
};
```

3. Import and add the tool to the tools registry in `src/server.js`.

### Add a New Resource

1. Create a new file in `src/resources/`.
2. Export a resource object with `uri`, `name`, `description`, `mimeType`, and `read` function.
3. Register the resource in the server resource registry.

### Add a New Prompt

1. Extend `src/prompts/index.js` with a new prompt object containing `name`, `description`, and a `generate` function.

---

## Integrations

### API Integration

* Obtain API keys for real services
* Update `src/tools/api-tool.js` to make real HTTP calls
* Add error handling, caching, and rate-limiting

### Database Integration

* Install drivers or ORMs (e.g., `sqlite3`, `pg`, `mysql2`)
* Update `src/tools/database-tool.js` to use real connection pooling and queries
* Sanitize inputs and use parameterized statements

---

## Logging & Error Handling

* All tool executions and resource access are logged in structured JSON.
* Errors include context and stack traces (respecting `NODE_ENV`).
* The server is designed to continue running when individual tools fail — errors are surfaced to clients in a standardized format.

---

## Security Considerations

* Validate and sanitize all inputs to tools/resources.
* Store secrets in environment variables or a secrets manager — do not commit keys.
* Add authentication and authorization when exposing the server publicly.
* Implement rate-limiting on tool endpoints that call external APIs.

---

## Testing

* Unit tests live in `tests/` and can be run with `npm test`.
* Include tests for input validation, tool execution, and resource reads.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests and documentation
4. Open a pull request with a clear description of changes

Please follow semantic commit messages and keep PRs focused.

---

## License

MIT License — see `LICENSE` for details.

---

## Support

If you encounter issues:

* Check the logs (path configured by `LOGS_PATH`).
* Verify `.env` configuration and API keys.
* Run example client in `tests/` to reproduce issues.
* Review MCP specification for expected behaviors.

For feature requests or help, open an issue or submit a PR.

---

*This README was generated as the single requested README file for the MCP Demo Server. No other files were changed.*

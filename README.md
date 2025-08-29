# MCP Server — README

> **MCP Server (Model Context Protocol)** — a modular, extensible Node.js reference implementation that exposes “tools”, “resources”, and structured “prompts” so an AI assistant can perform actions, read data, and produce structured responses.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running Locally](#running-locally)
6. [API Endpoints & Examples](#api-endpoints--examples)
7. [Folder Structure](#folder-structure)
8. [Configuration & Environment](#configuration--environment)
9. [Extending the Server](#extending-the-server)
10. [Logging & Error Handling](#logging--error-handling)
11. [Security Notes](#security-notes)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)
14. [License](#license)
15. [Contact / Next Steps](#contact--next-steps)

---

## Project Overview

This project demonstrates an MCP server that provides:

* **Tools** (actions AI can call): Math, API (mock), Database (mock).
* **Resources** (read-only data): System logs, User profiles.
* **Prompts** (templates): Data analysis, Report generation, Troubleshooting.

It is intended as a learning / reference implementation that is simple to run locally and easy to extend for production use.

---

## Key Features

* Exposes tool endpoints (HTTP) that accept structured JSON and return structured results.
* Serves resource endpoints to read logs and profiles.
* Includes prompt templates to guide structured AI output.
* Configurable via environment variables.
* Centralized logging and consistent error responses.
* Modular codebase for rapid extension.

---

## Prerequisites

* Node.js v16+ (LTS recommended)
* npm (6+ or included with Node.js)
* Git (optional, for cloning)

---

## Installation

1. Clone or copy the project:

   ```bash
   git clone <repo-url> mcp-demo-server
   cd mcp-demo-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment example:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you want to change defaults.

---

## Running Locally

Start the server:

```bash
# production start
npm start

# development with auto-reload (requires nodemon)
npm run dev
```

Default: the server listens on the `PORT` specified in `.env` (default `3000`).

Open in your browser or use curl/Postman:

```
http://localhost:3000/health
```

---

## API Endpoints & Examples

All endpoints accept and return JSON unless noted.

### Health

* `GET /health`
  Response:

  ```json
  { "status": "ok", "uptime": 123.45 }
  ```

### Tools

#### Math Tool

* `POST /tools/math`
  Body examples:

  ```json
  { "op": "add", "operands": [10, 20, 30] }
  ```

  Supported ops: `add`, `subtract`, `multiply`, `divide`, `pow`, `sqrt`, `factorial`, `eval` (expression).

  Response:

  ```json
  { "result": 60 }
  ```

#### API Tool (mock)

* `POST /tools/api`
  Body:

  ```json
  { "type": "weather", "city": "Tokyo" }
  ```

  Supported types: `weather`, `quote`, `news`. Returns mock structured data.

#### Database Tool (mock)

* `POST /tools/db`
  Body:

  ```json
  { "table": "users", "action": "select", "filter": { "city": "Tokyo" }, "limit": 10 }
  ```

  Supported tables: `users`, `orders`, `products`. Actions: `select`, `count`, `search`.

### Resources

#### Logs

* `GET /resources/logs`
  Query params (optional): `level=error`, `limit=50`
  Returns array of log entries from sample data.

#### Profiles

* `GET /resources/profiles`
  Query params (optional): `username=john_doe`
  Returns profile(s) from sample data.

### Prompts

* `GET /prompts/:name`
  Example: `GET /prompts/data-analysis`
  Returns text template for the requested prompt.

---

## Folder Structure

```
mcp-demo-server/
├── src/
│   ├── index.js                # Express app + server start
│   ├── config/
│   │   └── index.js            # env loader & defaults
│   ├── tools/
│   │   ├── mathTool.js
│   │   ├── apiTool.js
│   │   └── dbTool.js
│   ├── resources/
│   │   ├── logsResource.js
│   │   └── profilesResource.js
│   ├── prompts/
│   │   └── templates.js
│   ├── routes/
│   │   ├── tools.js
│   │   ├── resources.js
│   │   ├── prompts.js
│   │   └── health.js
│   └── utils/
│       ├── logger.js
│       └── errors.js
├── data/
│   ├── logs.json
│   └── profiles.json
├── tests/
│   └── client-example.js
├── .env.example
├── package.json
└── README.md
```

---

## Configuration & Environment

Example `.env.example`:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DEFAULT_DB_LIMIT=50
```

All configuration values should be read from environment variables. Use `src/config/index.js` to centralize defaults and parsing.

---

## Extending the Server

### Add a new tool

1. Create a new file in `src/tools/`, e.g. `src/tools/emailTool.js`.
2. Implement and export a `run(params)` function that returns a result object or throws errors.
3. Register the tool in `src/tools/index.js` (a registry) so `routes/tools.js` can call it.
4. Add tests and update README examples.

### Add a resource

1. Add static data under `data/` or implement a dynamic loader in `src/resources/`.
2. Add a resource handler file in `src/resources/` and expose it via `src/routes/resources.js`.

### Add prompt templates

1. Add templates in `src/prompts/templates.js`.
2. Expose them through `src/routes/prompts.js`.

---

## Logging & Error Handling

* Use `src/utils/logger.js` for consistent logs (method, path, status, timestamps).
* Errors should be normalized to a JSON shape:

  ```json
  { "error": "BadRequest", "message": "Detailed message" }
  ```
* Control verbosity with `LOG_LEVEL`.

---

## Security Notes

* This reference implementation is designed for local development and learning.
* **Do not** expose it to the public internet without:

  * Authentication & authorization
  * Input validation & sanitization for all external inputs
  * Rate limiting
  * Proper CORS configuration
  * Secure storage for any real secrets (do not put secrets in `.env` in shared repos)

---

## Testing

* Example client: `node tests/client-example.js` demonstrates:

  * calling math tool
  * calling api tool
  * reading logs and profiles
* Use Postman or curl for manual testing.

---

## Troubleshooting

* **Port already in use** (`EADDRINUSE`): change `PORT` in `.env`.
* **Module not found**: ensure `npm install` completed successfully.
* **Invalid JSON**: set `Content-Type: application/json` in requests.

---

## License

MIT — free to use, modify, and adapt for learning and prototyping. If you publish derived work publicly, attribution is appreciated.

---

## Contact / Next Steps

If you want:

* The **complete code for every file** ready to copy-paste, I can generate the full codebase next.
* A **single-file quick-start** (one `server.js`) for immediate testing, I can provide that too.

Choose which one you prefer and I’ll provide it.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import { logger } from '../src/utils/logger.js';

class MCPClientExample {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async connect() {
    try {
      logger.info('Starting MCP client example');

      // Spawn the server process
      const serverProcess = spawn('node', ['src/server.js'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'inherit']
      });

      // Create transport
      this.transport = new StdioClientTransport({
        readable: serverProcess.stdout,
        writable: serverProcess.stdin
      });

      // Create and connect client
      this.client = new Client({
        name: 'mcp-demo-client',
        version: '1.0.0'
      }, {
        capabilities: {}
      });

      await this.client.connect(this.transport);
      logger.info('Connected to MCP server');

      return true;
    } catch (error) {
      logger.error('Failed to connect to MCP server', error);
      return false;
    }
  }

  async runExamples() {
    if (!this.client) {
      throw new Error('Client not connected');
    }

    console.log('\n=== MCP SERVER DEMO EXAMPLES ===\n');

    // Example 1: List available tools
    console.log('1. Listing available tools...');
    const tools = await this.client.listTools();
    console.log('Available tools:', tools.tools.map(t => t.name));

    // Example 2: Use math tool
    console.log('\n2. Testing math tool...');
    const mathResult = await this.client.callTool({
      name: 'calculate_math',
      arguments: {
        operation: 'add',
        numbers: [10, 20, 30]
      }
    });
    console.log('Math result:', JSON.parse(mathResult.content[0].text));

    // Example 3: Use API tool
    console.log('\n3. Testing API tool...');
    const apiResult = await this.client.callTool({
      name: 'fetch_api_data',
      arguments: {
        endpoint: 'weather',
        params: { city: 'Tokyo' }
      }
    });
    console.log('API result:', JSON.parse(apiResult.content[0].text));

    // Example 4: Use database tool
    console.log('\n4. Testing database tool...');
    const dbResult = await this.client.callTool({
      name: 'query_database',
      arguments: {
        query_type: 'select',
        table: 'users',
        limit: 2
      }
    });
    console.log('Database result:', JSON.parse(dbResult.content[0].text));

    // Example 5: List and read resources
    console.log('\n5. Testing resources...');
    const resources = await this.client.listResources();
    console.log('Available resources:', resources.resources.map(r => r.name));

    const logsData = await this.client.readResource({
      uri: 'logs://system'
    });
    console.log('Logs resource preview:', JSON.parse(logsData.contents[0].text).summary);

    // Example 6: List and use prompts
    console.log('\n6. Testing prompts...');
    const prompts = await this.client.listPrompts();
    console.log('Available prompts:', prompts.prompts.map(p => p.name));

    const promptResult = await this.client.getPrompt({
      name: 'analyze_data',
      arguments: {
        data_source: 'logs',
        analysis_type: 'summary'
      }
    });
    console.log('Generated prompt:', promptResult.messages[0].content.text.substring(0, 100) + '...');

    console.log('\n=== ALL EXAMPLES COMPLETED SUCCESSFULLY ===\n');
  }

  async disconnect() {
    if (this.client && this.transport) {
      await this.client.close();
      logger.info('Disconnected from MCP server');
    }
  }
}

// Run the example
async function main() {
  const client = new MCPClientExample();
  
  try {
    const connected = await client.connect();
    if (!connected) {
      process.exit(1);
    }

    await client.runExamples();
    await client.disconnect();
    
    process.exit(0);
  } catch (error) {
    logger.error('Client example failed', error);
    await client.disconnect();
    process.exit(1);
  }
}

main();
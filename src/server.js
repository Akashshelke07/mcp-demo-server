import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { logger } from './utils/logger.js';
import { config } from './utils/config.js';

// Import tools
import { apiTool } from './tools/api-tool.js';
import { mathTool } from './tools/math-tool.js';
import { databaseTool } from './tools/database-tool.js';

// Import resources
import { logsResource } from './resources/logs-resource.js';
import { profilesResource } from './resources/profiles-resource.js';

// Import prompts
import { prompts } from './prompts/index.js';

class MCPDemoServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mcp-demo-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );

    this.tools = [apiTool, mathTool, databaseTool];
    this.resources = [logsResource, profilesResource];
    this.setupHandlers();
  }

  setupHandlers() {
    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.info('Listing available tools');
      
      return {
        tools: this.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info('Tool call requested', { name, args });

      const tool = this.tools.find(t => t.name === name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        const result = await tool.execute(args);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Tool execution failed', { name, error: error.message });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message,
                tool: name
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });

    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      logger.info('Listing available resources');
      
      return {
        resources: this.resources.map(resource => ({
          uri: resource.uri,
          name: resource.name,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      logger.info('Resource read requested', { uri });

      const resource = this.resources.find(r => r.uri === uri);
      if (!resource) {
        throw new Error(`Unknown resource: ${uri}`);
      }

      try {
        const result = await resource.read();
        return result;
      } catch (error) {
        logger.error('Resource read failed', { uri, error: error.message });
        throw error;
      }
    });

    // Prompt handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      logger.info('Listing available prompts');
      
      return {
        prompts: Object.values(prompts).map(prompt => ({
          name: prompt.name,
          description: prompt.description,
          arguments: prompt.arguments,
        })),
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info('Prompt requested', { name, args });

      const prompt = prompts[name];
      if (!prompt) {
        throw new Error(`Unknown prompt: ${name}`);
      }

      try {
        const result = await prompt.generate(args || {});
        return result;
      } catch (error) {
        logger.error('Prompt generation failed', { name, error: error.message });
        throw error;
      }
    });

    // Error handling
    this.server.onerror = (error) => {
      logger.error('MCP Server error', error);
    };
  }

  async start() {
    logger.info('Starting MCP Demo Server', { 
      nodeEnv: config.nodeEnv,
      logLevel: config.logLevel 
    });

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('MCP Demo Server started successfully');
    
    // Keep the process running
    process.on('SIGINT', () => {
      logger.info('Shutting down MCP Demo Server');
      process.exit(0);
    });
  }
}

// Start the server
const server = new MCPDemoServer();
server.start().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
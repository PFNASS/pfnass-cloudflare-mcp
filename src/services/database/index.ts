// import { Server } from '@modelcontextprotocol/sdk/server/index.js';
// import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// import {
//   CallToolRequestSchema,
//   ListToolsRequestSchema,
//   McpError,
//   ErrorCode,
// } from '@modelcontextprotocol/sdk/types.js';

// import { HomeAssistantService } from '../home-assistant/index.js';
// import { BaseService } from '../base/base-service.js';
// import { ServerResponse } from 'http';

// interface Env {
//   // Home Assistant Configuration
//   HA_BASE_URL?: string;
//   HA_TOKEN?: string;
  
//   // Database Configuration (for future services)
// //   DB_HOST?: string;
// //   DB_NAME?: string;
// //   DB_USER?: string;
// //   DB_PASSWORD?: string;
// }

// export default {
//   async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
//     // Initialize services based on available configuration
//     const services: BaseService[] = [];

//     // Home Assistant Service
//     if (env.HA_BASE_URL && env.HA_TOKEN) {
//       services.push(new HomeAssistantService(env.HA_BASE_URL, env.HA_TOKEN));
//     }

//     // Future: Database Service
//     // if (env.DB_HOST && env.DB_NAME) {
//     //   services.push(new DatabaseService(env.DB_HOST, env.DB_NAME, env.DB_USER, env.DB_PASSWORD));
//     // }

//     // Collect all tools from enabled services
//     const allTools = services.flatMap(service => 
//       service.getTools().map(tool => ({
//         ...tool,
//         name: `${service.getName()}.${tool.name}`
//       }))
//     );

//     // Create MCP Server
//     const server = new Server(
//       {
//         name: 'multi-service-mcp-server',
//         version: '1.0.0',
//       },
//       {
//         capabilities: {
//           tools: {},
//         },
//       }
//     );

//     // Handle tool listing
//     server.setRequestHandler(ListToolsRequestSchema, async () => {
//       return {
//         tools: allTools,
//       };
//     });

//     // Handle tool execution
//     server.setRequestHandler(CallToolRequestSchema, async (request) => {
//       const toolName = request.params.name;
//       const [serviceName, actualToolName] = toolName.split('.', 2);

//       if (!actualToolName) {
//         throw new McpError(ErrorCode.InvalidRequest, `Invalid tool name format: ${toolName}`);
//       }

//       const service = services.find(s => s.getName() === serviceName);
//       if (!service) {
//         throw new McpError(ErrorCode.MethodNotFound, `Service not found: ${serviceName}`);
//       }

//       const result = await service.executeTool(actualToolName, request.params.arguments || {});
      
//       return {
//         content: result.content,
//         isError: result.isError,
//       };
//     });

//     // Handle SSE transport
//     const transport = new SSEServerTransport('/sse', ServerResponse<IncomingMessage>);
//     await server.connect(transport);

//     return transport.response;
//   },
// };

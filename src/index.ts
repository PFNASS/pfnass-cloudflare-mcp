// /src/server/buildMcpServer.ts
import { McpAgent } from 'agents/mcp'; // Use correct import per SDK docs
import { HomeAssistantService } from './services/home-assistant/index.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// ...import other services

type Env = {
  pfnassMcpServers: DurableObjectNamespace<pfnassMcpServers>;
};

export class pfnassMcpServers extends McpAgent {
    server = new McpServer({ name: "pfnass-mcp-servers", version: "1.0.0"});
    hass = new HomeAssistantService(
        process.env.HA_BASE_URL || '',
        process.env.HA_TOKEN || ''
    );

    async init() {
        const hass_tools = this.hass.getTools()
        hass_tools.forEach(x => 
            this.server.tool(
                x.name,
                x.description,
                x.inputSchema,
                async (args: any, extra: any) => {
                    const result = await this.hass.executeTool(x.name, args);
                    return {
                        content: [
                            {
                                type: "text",
                                text: typeof result === "string" ? result : JSON.stringify(result)
                            },
                        ],
                    };
                }
            )
        );
    }
}

// export default pfnassMcpServers.mount("/sse", {
//   binding: "pfnassMcpServers",
// });

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return pfnassMcpServers.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return pfnassMcpServers.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
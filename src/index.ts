// /src/server/buildMcpServer.ts
import { McpAgent } from 'agents/mcp'; // Use correct import per SDK docs
import { HomeAssistantService } from './services/home-assistant/index.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// ...import other services

type Env = {
  MyMCP: DurableObjectNamespace<pfnassMcpServers>;
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

export default pfnassMcpServers.mount("/sse", {
  binding: "pfnassMcpServers",
});

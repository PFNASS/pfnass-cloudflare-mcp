import { BaseService } from '../base/base-service.js';
import { ToolDefinition, ToolResult } from '../../types/index.js';
import { HomeAssistantClient } from './api-client.js';
import { HomeAssistantTools } from './tools.js';

export class HomeAssistantService extends BaseService {
  private tools: HomeAssistantTools;

  constructor(baseUrl: string, token: string) {
    super();
    const client = new HomeAssistantClient(baseUrl, token);
    this.tools = new HomeAssistantTools(client);
  }

  getName(): string {
    return 'home-assistant';
  }

  getTools(): ToolDefinition[] {
    return this.tools.getToolDefinitions();
  }

  async executeTool(name: string, arguments_: any): Promise<ToolResult> {
    try {
      return await this.tools.executeTool(name, arguments_);
    } catch (error) {
      return this.formatError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

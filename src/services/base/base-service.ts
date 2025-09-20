import { ToolDefinition, ToolResult } from '../../types/index.js';

export abstract class BaseService {
  abstract getName(): string;
  abstract getTools(): ToolDefinition[];
  abstract executeTool(name: string, arguments_: any): Promise<ToolResult>;
  
  protected formatError(error: string): ToolResult {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error}`
      }],
      isError: true
    };
  }

  protected formatSuccess(data: any): ToolResult {
    return {
      content: [{
        type: 'text',
        text: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }],
      isError: false
    };
  }
}

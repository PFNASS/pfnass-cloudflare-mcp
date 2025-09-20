export interface ServiceConfig {
  name: string;
  enabled: boolean;
  tools: string[];
}

export interface PFNASSMcpConfig {
  services: Record<string, ServiceConfig>;
  environment: 'development' | 'production';
}

export interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

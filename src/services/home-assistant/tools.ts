import { ToolDefinition, ToolResult } from '../../types/index.js';
import { HomeAssistantClient } from './api-client.js';

export class HomeAssistantTools {
  private client: HomeAssistantClient;

  constructor(client: HomeAssistantClient) {
    this.client = client;
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'get_entity_state',
        description: 'Get the current state and attributes of a Home Assistant entity',
        inputSchema: {
          type: 'object',
          properties: {
            entity_id: {
              type: 'string',
              description: 'The entity ID to retrieve (e.g., light.living_room, sensor.temperature)'
            }
          },
          required: ['entity_id']
        }
      },
      {
        name: 'get_logbook_entries',
        description: 'Get Home Assistant logbook entries for monitoring entity changes and events',
        inputSchema: {
          type: 'object',
          properties: {
            entity_id: {
              type: 'string',
              description: 'Optional: Filter logs for specific entity ID'
            },
            start_time: {
              type: 'string',
              description: 'Optional: Start time in ISO format (YYYY-MM-DDTHH:MM:SS+TZ). Defaults to 24 hours ago'
            },
            end_time: {
              type: 'string',
              description: 'Optional: End time in ISO format (YYYY-MM-DDTHH:MM:SS+TZ). Defaults to now'
            }
          },
          required: []
        }
      }
    ];
  }

  async executeTool(name: string, arguments_: any): Promise<ToolResult> {
    switch (name) {
      case 'get_entity_state':
        return this.getEntityState(arguments_.entity_id);
      
      case 'get_logbook_entries':
        return this.getLogbookEntries(
          arguments_.start_time,
          arguments_.end_time,
          arguments_.entity_id
        );
      
      default:
        return {
          content: [{
            type: 'text',
            text: `Unknown tool: ${name}`
          }],
          isError: true
        };
    }
  }

  private async getEntityState(entityId: string): Promise<ToolResult> {
    if (!entityId) {
      return {
        content: [{
          type: 'text',
          text: 'Error: entity_id is required'
        }],
        isError: true
      };
    }

    const response = await this.client.getEntityState(entityId);
    
    if (response.error) {
      return {
        content: [{
          type: 'text',
          text: `Error retrieving entity state: ${response.error}`
        }],
        isError: true
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(response.data, null, 2)
      }],
      isError: false
    };
  }

  private async getLogbookEntries(
    startTime?: string,
    endTime?: string,
    entityId?: string
  ): Promise<ToolResult> {
    const response = await this.client.getLogbookEntries(startTime, endTime, entityId);
    
    if (response.error) {
      return {
        content: [{
          type: 'text',
          text: `Error retrieving logbook entries: ${response.error}`
        }],
        isError: true
      };
    }

    const entries = response.data || [];
    return {
      content: [{
        type: 'text',
        text: `Found ${entries.length} logbook entries:\n\n${JSON.stringify(entries, null, 2)}`
      }],
      isError: false
    };
  }
}

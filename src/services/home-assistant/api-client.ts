import { HttpClient } from '../base/http-client.js';
import { HAEntityState, HALogbookEntry, HAApiResponse } from '../../types/home-assistant.js';

export class HomeAssistantClient {
  private httpClient: HttpClient;

  constructor(baseUrl: string, token: string) {
    this.httpClient = new HttpClient(baseUrl, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  async getEntityState(entityId: string): Promise<HAApiResponse<HAEntityState>> {
    try {
      const data = await this.httpClient.get<HAEntityState>(`/api/states/${entityId}`);
      return { data, status: 200 };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }

  async getAllStates(): Promise<HAApiResponse<HAEntityState[]>> {
    try {
      const data = await this.httpClient.get<HAEntityState[]>('/api/states');
      return { data, status: 200 };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }

  async getLogbookEntries(
    startTime?: string,
    endTime?: string,
    entityId?: string
  ): Promise<HAApiResponse<HALogbookEntry[]>> {
    try {
      let endpoint = '/api/logbook';
      
      if (startTime) {
        endpoint += `/${startTime}`;
      }

      const params = new URLSearchParams();
      if (endTime) {
        params.append('end_time', endTime);
      }
      if (entityId) {
        params.append('entity', entityId);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const data = await this.httpClient.get<HALogbookEntry[]>(endpoint);
      return { data, status: 200 };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }
}

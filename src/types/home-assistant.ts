export interface HAEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id?: string;
    user_id?: string;
  };
}

export interface HALogbookEntry {
  when: string;
  name: string;
  message: string;
  domain: string;
  entity_id: string;
  context_user_id?: string;
}

export interface HAApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

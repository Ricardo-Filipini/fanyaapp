export interface Message {
  id?: string;
  chat_id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
}

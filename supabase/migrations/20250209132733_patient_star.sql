/*
  # Criação das tabelas de chat e mensagens

  1. Novas Tabelas
    - `chats`
      - `id` (uuid, primary key)
      - `title` (text)
      - `created_at` (timestamp)
      - `last_message` (text, opcional)
    
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, foreign key)
      - `role` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Segurança
    - RLS habilitado para ambas as tabelas
    - Políticas para leitura e escrita
*/

-- Tabela de chats
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_message text
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chats
CREATE POLICY "Permitir acesso público aos chats"
  ON chats
  FOR ALL
  USING (true);

-- Políticas para mensagens
CREATE POLICY "Permitir acesso público às mensagens"
  ON messages
  FOR ALL
  USING (true);

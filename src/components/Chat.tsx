import React, { useState } from 'react';
import { Send, Plus, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chat } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import { useChatStore, useThemeStore } from '../lib/store';
import type { Message } from '../types';

export function Chat() {
  const { messages, currentChatId, setCurrentChatId, setMessages, addMessage, isChatExpanded, toggleChat, loadChats } = useChatStore();
  const { isDarkMode } = useThemeStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function createNewChat() {
    const { data } = await supabase
      .from('chats')
      .insert({
        title: 'Nova Conversa',
      })
      .select()
      .single();

    if (data) {
      setCurrentChatId(data.id);
      setMessages([]);
      loadChats(); // Call loadChats here to refresh the chat history
    }
  }

  async function saveMessage(message: Message) {
    if (!currentChatId) return;

    const { data } = await supabase
      .from('messages')
      .insert({
        ...message,
        chat_id: currentChatId,
      })
      .select()
      .single();

    if (data) {
      addMessage(data);

      if (message.role === 'user' && messages.length === 0) {
        await supabase
          .from('chats')
          .update({ title: message.content.slice(0, 50) })
          .eq('id', currentChatId);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!currentChatId) {
      await createNewChat();
    }

    const userMessage: Message = { role: 'user', content: input };
    setInput('');
    setIsLoading(true);

    await saveMessage(userMessage);

    try {
      const context = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = `${context}\nuser: ${input}`;

      const response = await chat(prompt);
      const assistantMessage: Message = { role: 'assistant', content: response };
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isChatExpanded) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h2 className="text-lg font-semibold">
          {currentChatId ? 'Chat Atual' : 'Nova Conversa'}
        </h2>
        <div className="flex space-x-2 items-center">
          <button
            onClick={createNewChat}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Nova conversa"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={toggleChat}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            title="Minimizar Chat"
          >
            <Minimize2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-white shadow-md'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'
            }`}>
              <div className="animate-pulse">Digitando...</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`p-4 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

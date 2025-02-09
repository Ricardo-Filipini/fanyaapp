import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Edit2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useChatStore, useThemeStore } from '../lib/store';
import type { Chat } from '../types';

export function ChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { currentChatId, setCurrentChatId, setMessages } = useChatStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setChats(data);
  }

  async function selectChat(chatId: string) {
    setCurrentChatId(chatId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  }

  async function deleteChat(chatId: string) {
    await supabase.from('chats').delete().eq('id', chatId);
    await supabase.from('messages').delete().eq('chat_id', chatId);
    await loadChats();
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }

  async function startEditing(chat: Chat) {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  }

  async function saveTitle(chatId: string) {
    if (editTitle.trim()) {
      await supabase
        .from('chats')
        .update({ title: editTitle.trim() })
        .eq('id', chatId);
      await loadChats();
    }
    setEditingId(null);
    setEditTitle('');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Histórico de Conversas</h2>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              isDarkMode 
                ? currentChatId === chat.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                : currentChatId === chat.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <div
              className="flex items-center space-x-3 flex-1 cursor-pointer"
              onClick={() => selectChat(chat.id)}
            >
              <MessageSquare size={20} />
              <div className="flex-1 truncate">
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTitle(chat.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className={`w-full px-2 py-1 rounded ${
                      isDarkMode 
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                    autoFocus
                  />
                ) : (
                  <p className="text-sm">{chat.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editingId === chat.id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveTitle(chat.id);
                  }}
                  className={`p-1 rounded ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <Check size={16} />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(chat);
                  }}
                  className={`p-1 rounded ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <Edit2 size={16} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className={`p-1 rounded ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
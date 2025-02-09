import { create } from 'zustand';
import { Message, Chat } from '../types';
import { supabase } from './supabase';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
  currentView: 'history' | 'scrape';
  setCurrentView: (view: 'history' | 'scrape') => void;
}

interface ChatState {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  isChatExpanded: boolean;
  toggleChat: () => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  loadChats: () => Promise<void>;
}

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  currentView: 'history',
  setCurrentView: (view) => set({ currentView: view }),
}));

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: null,
  setCurrentChatId: (id) => set({ currentChatId: id }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  isChatExpanded: true,
  toggleChat: () => set((state) => ({ isChatExpanded: !state.isChatExpanded })),
  chats: [],
  setChats: (chats) => set({ chats }),
  loadChats: async () => {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      set({ chats: data });
    }
  },
}));

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

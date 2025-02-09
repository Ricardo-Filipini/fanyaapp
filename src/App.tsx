import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { ChatHistory } from './components/ChatHistory';
import { Scrape } from './components/Scrape';
import { useThemeStore, useChatStore, useSidebarStore } from './lib/store';
import { MessageSquare, Minimize2, Maximize2 } from 'lucide-react';

function App() {
  const { isDarkMode } = useThemeStore();
  const { isChatExpanded, toggleChat } = useChatStore();
  const { currentView } = useSidebarStore();

  return (
    <div className={`flex h-screen ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <Sidebar />

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={100} minSize={30}>
          {currentView === 'history' ? <ChatHistory /> : <Scrape />}
        </Panel>

        {isChatExpanded && (
          <>
            <PanelResizeHandle className={`w-2 hover:bg-gray-300 transition-colors ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div className={`w-1 h-full mx-auto ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`} />
            </PanelResizeHandle>

            <Panel defaultSize={30} minSize={20}>
              <Chat />
            </Panel>
          </>
        )}
      </PanelGroup>

      {!isChatExpanded && (
        <button
          onClick={toggleChat}
          className={`fixed top-4 right-4 p-2 rounded-full shadow-lg z-50 ${
            isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200'
          }`}
          title={isChatExpanded ? "Minimize Chat" : "Maximize Chat"}
        >
          <MessageSquare size={20} />
        </button>
      )}
    </div>
  );
}

export default App

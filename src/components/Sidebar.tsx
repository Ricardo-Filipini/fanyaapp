import React from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, Sun, Moon, Scissors } from 'lucide-react';
import { useSidebarStore, useThemeStore } from '../lib/store';

export function Sidebar() {
  const { isExpanded, toggleSidebar, currentView, setCurrentView } = useSidebarStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-all duration-300 flex flex-col ${
      isExpanded ? 'w-64' : 'w-16'
    } border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {isExpanded && <span className="text-xl font-semibold">Menu</span>}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <button 
              onClick={() => setCurrentView('history')}
              className={`flex items-center space-x-3 p-2 rounded-lg w-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${currentView === 'history' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
            >
              <MessageSquare size={24} />
              {isExpanded && <span>Histórico</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentView('scrape')}
              className={`flex items-center space-x-3 p-2 rounded-lg w-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${currentView === 'scrape' ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
            >
              <Scissors size={24} />
              {isExpanded && <span>Web Scrape</span>}
            </button>
          </li>
        </ul>
      </nav>
      
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button 
          onClick={toggleTheme}
          className={`flex items-center space-x-3 p-2 rounded-lg w-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          {isExpanded && <span>{isDarkMode ? 'Tema Claro' : 'Tema Escuro'}</span>}
        </button>
      </div>
    </div>
  );
}
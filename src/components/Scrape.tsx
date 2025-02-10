import React, { useState } from 'react';
import { useThemeStore } from '../lib/store';
import { Search } from 'lucide-react';

export function Scrape() {
  const { isDarkMode } = useThemeStore();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica de scraping
    // Por enquanto apenas mostramos os valores inseridos
    setResult(`URL: ${url}`);
  };

  return (
    <div className="h-full p-6">
      <div className={`h-full rounded-lg shadow-md p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-2xl font-bold mb-6">Web Scraping</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">URL do Site</label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-blue-500 text-gray-500 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

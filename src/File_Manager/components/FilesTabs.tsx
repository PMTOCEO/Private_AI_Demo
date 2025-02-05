import { FilesSearchBar } from './FilesSearchBar';

interface FileTabsProps {
  activeTab: 'my-files' | 'shared';
  onTabChange: (tab: 'my-files' | 'shared') => void;
}

export function FilesTabs({ activeTab, onTabChange }: FileTabsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-8">
        <button 
          onClick={() => onTabChange('my-files')}
          className={`py-2 font-medium transition-colors duration-200 ${
            activeTab === 'my-files' 
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          My Files
        </button>
        <button 
          onClick={() => onTabChange('shared')}
          className={`py-2 font-medium transition-colors duration-200 ${
            activeTab === 'shared' 
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Shared
        </button>
      </div>
      <FilesSearchBar />
    </div>
  );
}
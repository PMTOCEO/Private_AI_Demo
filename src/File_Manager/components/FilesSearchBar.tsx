import { Search, X, Loader } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export function FilesSearchBar() {
  const { searchQuery, setSearchQuery, isSearching } = useSearch();

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search files, folders & contents..."
        className="pl-4 pr-24 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-[400px] 
          focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          bg-white dark:bg-gray-900 transition-colors duration-200"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isSearching && (
          <Loader className="w-4 h-4 text-gray-400 dark:text-gray-500 animate-spin" />
        )}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}
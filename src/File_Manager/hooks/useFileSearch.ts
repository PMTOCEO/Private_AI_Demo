import { useState, useCallback, useEffect } from 'react';
import { FileItem } from '../types/file';
import { searchFiles } from '../utils/searchUtils';

export function useFileSearch(allFiles: FileItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Use setTimeout to prevent UI blocking on large file sets
        await new Promise(resolve => setTimeout(resolve, 0));
        const results = searchFiles(allFiles, query);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    },
    [allFiles]
  );

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, performSearch]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
}
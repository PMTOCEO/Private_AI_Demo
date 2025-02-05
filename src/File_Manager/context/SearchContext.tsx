import React, { createContext, useContext } from 'react';
import { useFileSearch } from '../hooks/useFileSearch';
import { FileItem } from '../types/file';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: FileItem[];
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ 
  children, 
  files 
}: { 
  children: React.ReactNode;
  files: FileItem[];
}) {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useFileSearch(files);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      searchResults,
      isSearching
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const SearchContext = createContext<{
  searchString: string;
  setSearchString: (searchString: string) => void;
}>({
  searchString: '',
  setSearchString: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchString, setSearchString] = useState<string>('');
  return (
    <SearchContext.Provider value={{ searchString, setSearchString }}>
      {children}
    </SearchContext.Provider>
  );
};

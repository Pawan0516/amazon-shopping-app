import React, { useState } from 'react';
import { SearchContext } from './SearchContext';

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState([0, 100000]);

  return (
    <SearchContext.Provider value={{ query, setQuery, category, setCategory, price, setPrice }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
import React, { createContext, useState, useEffect } from "react";
import { searchProductApi } from "../services/allApi";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]); // Clear results if the query is empty
        return;
      }
      setIsLoading(true);
      try {
        const response = await searchProductApi(searchQuery);
        if (response.success) {
          setSearchResults(response.data.products);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        setSearchResults([]);
      }
      setIsLoading(false);
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchResults, isLoading }}>
      {children}
    </SearchContext.Provider>
  );
};

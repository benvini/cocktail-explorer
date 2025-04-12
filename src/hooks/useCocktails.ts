import { useState, useEffect, useCallback } from "react";

import { searchCocktails } from "../utils/api";
import { getCustomCocktails } from "../utils/storage";
import { Cocktail } from "../shared/types";

type UseCocktailsHook = {
  cocktails: Cocktail[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Cocktail[];
  searchError: string | null;
  refreshCocktails: () => void;
};

export const useCocktails = (): UseCocktailsHook => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchCustomCocktails = useCallback(() => {
    const customCocktails = getCustomCocktails();
    setCocktails(customCocktails);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setSearchError(null);

      try {
        const apiResults = await searchCocktails(searchQuery);

        const customCocktails = getCustomCocktails();
        const customResults = customCocktails.filter((cocktail) =>
          cocktail.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults([...customResults, ...apiResults]);
      } catch (err) {
        setSearchError("Search failed. Please try again.");
        console.error("Error in search:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceSearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomCocktails();
  }, [fetchCustomCocktails]);

  return {
    cocktails,
    loading,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchError,
    refreshCocktails: fetchCustomCocktails,
  };
};

export default useCocktails;

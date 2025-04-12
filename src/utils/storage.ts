import { Cocktail } from "../shared/types";

const CUSTOM_COCKTAILS_KEY = "custom_cocktails";

export const getCustomCocktails = (): Cocktail[] => {
  try {
    const customCocktailsJson = localStorage.getItem(CUSTOM_COCKTAILS_KEY);
    if (!customCocktailsJson) {
      return [];
    }

    const customCocktails = JSON.parse(customCocktailsJson);
    return customCocktails.map((cocktail: Cocktail) => ({
      ...cocktail,
      isCustom: true,
    }));
  } catch (error) {
    console.error("Error getting custom cocktails:", error);
    return [];
  }
};

export const addCustomCocktail = (
  cocktail: Omit<Cocktail, "id" | "isCustom">
): Cocktail => {
  try {
    const customCocktails = getCustomCocktails();

    const newCocktail: Cocktail = {
      ...cocktail,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };

    customCocktails.push(newCocktail);
    localStorage.setItem(CUSTOM_COCKTAILS_KEY, JSON.stringify(customCocktails));

    return newCocktail;
  } catch (error) {
    console.error("Error adding custom cocktail:", error);
    throw error;
  }
};

export const removeCustomCocktail = (id: string): boolean => {
  try {
    const customCocktails = getCustomCocktails();
    const filteredCocktails = customCocktails.filter(
      (cocktail) => cocktail.id !== id
    );

    if (filteredCocktails.length === customCocktails.length) {
      return false;
    }

    localStorage.setItem(
      CUSTOM_COCKTAILS_KEY,
      JSON.stringify(filteredCocktails)
    );
    return true;
  } catch (error) {
    console.error("Error removing custom cocktail:", error);
    return false;
  }
};

export const updateCustomCocktail = (cocktail: Cocktail): boolean => {
  try {
    const customCocktails = getCustomCocktails();
    const index = customCocktails.findIndex((c) => c.id === cocktail.id);

    if (index === -1) {
      return false;
    }

    customCocktails[index] = {
      ...cocktail,
      isCustom: true,
    };

    localStorage.setItem(CUSTOM_COCKTAILS_KEY, JSON.stringify(customCocktails));
    return true;
  } catch (error) {
    console.error("Error updating custom cocktail:", error);
    return false;
  }
};

export const getCustomCocktailById = (id: string): Cocktail | null => {
  try {
    const customCocktails = getCustomCocktails();
    const cocktail = customCocktails.find((c) => c.id === id);
    return cocktail || null;
  } catch (error) {
    console.error("Error getting custom cocktail by ID:", error);
    return null;
  }
};

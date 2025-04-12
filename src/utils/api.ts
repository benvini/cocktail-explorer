import axios from "axios";

import { Cocktail, GetCocktailByIdResponse, Ingredient } from "../shared/types";
import { BASE_URL } from "../shared/constants";

export const searchCocktails = async (query: string): Promise<Cocktail[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);

    if (!response.data.drinks) {
      return [];
    }

    return response.data.drinks.map(formatCocktail);
  } catch (error) {
    console.error("Error searching cocktails:", error);
    throw error;
  }
};

export const getCocktailById = async (id: string): Promise<Cocktail | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);

    if (!response.data.drinks) {
      return null;
    }
    console.log(response.data.drinks[0]);
    return formatCocktail(response.data.drinks[0]);
  } catch (error) {
    console.error("Error getting cocktail by ID:", error);
    throw error;
  }
};

// Format API response into the Cocktail type
const formatCocktail = (drink: GetCocktailByIdResponse): Cocktail => {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredientKey = `strIngredient${i}`;
    const measureKey = `strMeasure${i}`;

    if (drink[ingredientKey]) {
      ingredients.push({
        name: drink[ingredientKey],
        measure: drink[measureKey] || "",
      });
    }
  }

  return {
    id: drink.idDrink,
    name: drink.strDrink,
    image: drink.strDrinkThumb || "",
    category: drink.strCategory || "",
    alcoholic: drink.strAlcoholic || "",
    glass: drink.strGlass || "",
    instructions: drink.strInstructions || "",
    ingredients,
  };
};

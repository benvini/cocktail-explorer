import { Routes, Route } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen/RecipeScreen";
import AddCocktailScreen from "../screens/AddCocktailScreen/AddCocktailScreen";
import Layout from "../components/Layout/Layout";
import NotFoundScreen from "../screens/NotFoundScreen/NotFoundScreen";

const Navigation = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/recipe/:id" element={<RecipeScreen />} />
        <Route path="/add" element={<AddCocktailScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Layout>
  );
};

export default Navigation;

import SearchBar from "../../components/SearchBar/SearchBar";
import CocktailGrid from "../../components/CocktailGrid/CocktailGrid";
import useCocktails from "../../hooks/useCocktails";
import styles from "./HomeScreen.module.scss";

const HomeScreen = () => {
  const {
    cocktails,
    loading,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchError,
  } = useCocktails();

  const displayData = searchQuery ? searchResults : cocktails;
  const title = searchQuery
    ? `Search Results for "${searchQuery}"`
    : "Custom Cocktails";

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.title}>Cocktail Explorer</div>
        <div className={styles.subtitle}>Discover and create cocktails</div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          loading={loading}
          placeholder="Search for cocktails by name..."
        />
      </div>

      <CocktailGrid
        cocktails={displayData}
        loading={loading}
        error={searchError}
        title={title}
      />
    </div>
  );
};

export default HomeScreen;

import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CocktailForm from "../../components/CocktailForm/CocktailForm";
import styles from "./AddCocktailScreen.module.scss";
import { Cocktail } from "../../shared/types";

const AddCocktailScreen = () => {
  const navigate = useNavigate();

  const handleSuccess = (cocktail: Cocktail) => {
    setTimeout(() => {
      navigate(`/recipe/${cocktail.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <Box className={styles.banner}>
        <Container>
          <Typography variant="h3" component="h1" className={styles.title}>
            Create Your Own Cocktail
          </Typography>
          <Typography variant="h6" component="h2" className={styles.subtitle}>
            Add your favorite recipe to the collection
          </Typography>
        </Container>
      </Box>

      <Container className={styles.formContainer}>
        <CocktailForm onSuccess={handleSuccess} />
      </Container>
    </div>
  );
};

export default AddCocktailScreen;

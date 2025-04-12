import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalBarIcon from "@mui/icons-material/LocalBar";

import { getCocktailById } from "../../utils/api";
import {
  getCustomCocktailById,
  removeCustomCocktail,
} from "../../utils/storage";
import { Cocktail, Ingredient } from "../../shared/types";
import DeleteCocktailDialog from "../../components/DeleteCocktailDialog/DeleteCocktailDialog";
import CocktailForm from "../../components/CocktailForm/CocktailForm";
import styles from "./RecipeScreen.module.scss";

const RecipeScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cocktail, setCocktail] = useState<Cocktail>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCocktail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        if (id.startsWith("custom-")) {
          const customCocktail = getCustomCocktailById(id);
          if (customCocktail) {
            setCocktail(customCocktail);
            setLoading(false);
            return;
          }
        }

        const apiCocktail = await getCocktailById(id);
        if (apiCocktail) {
          setCocktail(apiCocktail);
        } else {
          setError("Cocktail not found");
        }
      } catch (err) {
        console.error("Error fetching cocktail:", err);
        setError("Failed to load cocktail details");
      } finally {
        setLoading(false);
      }
    };

    fetchCocktail();
  }, [id]);

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleDelete = () => {
    if (!id) {
      setDeleteError("Cocktail ID is missing");
      return;
    }

    const cocktailRemoved = removeCustomCocktail(id);
    if (cocktailRemoved) {
      handleGoBack();
    } else {
      setDeleteError("Failed to delete cocktail");
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteError(null);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleEditSubmit = (updatedCocktail: Cocktail) => {
    setCocktail(updatedCocktail);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Container className={styles.loadingContainer}>
          <CircularProgress />
        </Container>
      </div>
    );
  }

  if (error || !cocktail) {
    return (
      <div className={styles.container}>
        <Container className={styles.errorContainer}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Cocktail not found"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </Container>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className={styles.container}>
        <Container className={styles.contentContainer}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancelEdit}
            className={styles.backButton}
          >
            Cancel Edit
          </Button>
          <CocktailForm
            initialCocktail={cocktail}
            onSuccess={handleEditSubmit}
            isEditMode={true}
          />
        </Container>
      </div>
    );
  }

  const hasValidImage =
    cocktail.image &&
    !cocktail.image.includes("placeholder") &&
    !cocktail.image.endsWith("null") &&
    !cocktail.image.endsWith("undefined");

  return (
    <div className={styles.container}>
      <Container className={styles.contentContainer}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          className={styles.backButton}
        >
          Back Home
        </Button>

        <Grid container spacing={4} className={styles.recipeContainer}>
          <Grid sx={{ gridColumn: { xs: "span 12", md: "span 5" } }}>
            <Card className={styles.imageCard}>
              {hasValidImage ? (
                <img
                  src={cocktail.image}
                  alt={cocktail.name}
                  className={styles.image}
                />
              ) : (
                <Box className={styles.placeholderContainer}>
                  <LocalBarIcon className={styles.placeholderIcon} />
                  <Typography
                    variant="body2"
                    className={styles.placeholderText}
                  >
                    No Image Available
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", md: "span 7" } }}>
            <Box className={styles.detailsContainer}>
              <Typography variant="h3" component="h1" className={styles.title}>
                {cocktail.name}
                {cocktail.isCustom && (
                  <Chip
                    label="Custom"
                    color="primary"
                    size="small"
                    className={styles.customChip}
                  />
                )}
              </Typography>

              {cocktail.isCustom && (
                <Box className={styles.actionButtons}>
                  <IconButton
                    color="primary"
                    onClick={handleEdit}
                    className={styles.editButton}
                    title="Edit cocktail"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={handleOpenDeleteDialog}
                    className={styles.deleteButton}
                    title="Delete cocktail"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              <Box className={styles.metaInfo}>
                {cocktail.alcoholic && (
                  <Typography variant="subtitle1" className={styles.meta}>
                    <strong>Type:</strong> {cocktail.alcoholic}
                  </Typography>
                )}

                {cocktail.category && (
                  <Typography variant="subtitle1" className={styles.meta}>
                    <strong>Category:</strong> {cocktail.category}
                  </Typography>
                )}

                {cocktail.glass && (
                  <Typography variant="subtitle1" className={styles.meta}>
                    <strong>Glass:</strong> {cocktail.glass}
                  </Typography>
                )}
              </Box>

              <Divider className={styles.divider} />

              <Typography
                variant="h5"
                component="h2"
                className={styles.sectionTitle}
              >
                Ingredients
              </Typography>

              <Paper className={styles.ingredientsList}>
                <List>
                  {cocktail.ingredients.map(
                    (ingredient: Ingredient, index: number) => (
                      <ListItem
                        key={index}
                        divider={index < cocktail.ingredients.length - 1}
                      >
                        <LocalBarIcon className={styles.ingredientIcon} />
                        <ListItemText
                          primary={ingredient.name}
                          secondary={ingredient.measure}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Paper>

              <Typography
                variant="h5"
                component="h2"
                className={styles.sectionTitle}
              >
                Instructions
              </Typography>

              <Paper className={styles.instructions}>
                <Typography variant="body1">{cocktail.instructions}</Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <DeleteCocktailDialog
        open={showDeleteDialog}
        closeDialog={handleCloseDeleteDialog}
        cocktail={cocktail}
        handleDelete={handleDelete}
        deleteError={deleteError}
      />
    </div>
  );
};

export default RecipeScreen;

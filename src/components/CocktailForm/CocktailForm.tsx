import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FileUpload } from "@mui/icons-material";

import { addCustomCocktail, updateCustomCocktail } from "../../utils/storage";
import { alcoholicOptions, glassOptions } from "../../shared/constants";
import { Cocktail, Ingredient } from "../../shared/types";
import styles from "./CocktailForm.module.scss";

type CocktailFormProps = {
  onSuccess?: (cocktail: Cocktail) => void;
  initialCocktail?: Cocktail;
  isEditMode?: boolean;
};

const CocktailForm = ({
  onSuccess,
  initialCocktail,
  isEditMode = false,
}: CocktailFormProps) => {
  const [name, setName] = useState("");
  const [glass, setGlass] = useState("");
  const [alcoholic, setAlcoholic] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", measure: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (initialCocktail) {
      setName(initialCocktail.name);
      setGlass(initialCocktail.glass);
      setAlcoholic(initialCocktail.alcoholic);
      setCategory(initialCocktail.category);
      setInstructions(initialCocktail.instructions);

      const cocktailIngredients =
        initialCocktail.ingredients.length > 0
          ? [...initialCocktail.ingredients]
          : [{ name: "", measure: "" }];

      setIngredients(cocktailIngredients);

      if (initialCocktail.image) {
        setPreviewUrl(initialCocktail.image);
      }
    }
  }, [initialCocktail]);

  useEffect(() => {
    const hasName = !!name.trim();
    const hasAlcoholic = !!alcoholic;
    const hasGlass = !!glass;
    const hasInstructions = !!instructions.trim();
    const hasIngredients = ingredients.some((ing) => !!ing.name.trim());

    setIsFormValid(
      hasName && hasAlcoholic && hasGlass && hasInstructions && hasIngredients
    );
  }, [name, alcoholic, glass, instructions, ingredients]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", measure: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "measure",
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!alcoholic) newErrors.alcoholic = "Type is required";
    if (!glass) newErrors.glass = "Glass type is required";
    if (!instructions.trim())
      newErrors.instructions = "Instructions are required";

    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const validIngredients = ingredients.filter((ing) => ing.name.trim());

      const cocktailData: Omit<Cocktail, "id" | "isCustom"> = {
        name,
        glass,
        alcoholic,
        category: category || "Custom",
        instructions,
        ingredients: validIngredients,
        image: previewUrl || "/placeholder-cocktail.jpg",
      };

      let savedCocktail: Cocktail;

      if (isEditMode && initialCocktail) {
        const updatedCocktail: Cocktail = {
          ...cocktailData,
          id: initialCocktail.id,
          isCustom: true,
        };

        const success = updateCustomCocktail(updatedCocktail);

        if (!success) {
          throw new Error("Failed to update cocktail");
        }

        savedCocktail = updatedCocktail;
        setSuccess(true);
        console.log("Cocktail updated successfully:", savedCocktail);
      } else {
        savedCocktail = addCustomCocktail(cocktailData);
        console.log("New cocktail saved successfully:", savedCocktail);
      }
      console.log("Cocktail saved successfully:", savedCocktail);

      if (!isEditMode) {
        setName("");
        setGlass("");
        setAlcoholic("");
        setCategory("");
        setInstructions("");
        setIngredients([{ name: "", measure: "" }]);
        setPreviewUrl("");
        setSelectedFile(null);
      }
      setSuccess(true);

      if (onSuccess) {
        onSuccess(savedCocktail);
      }
    } catch (err) {
      console.error("Error saving cocktail:", err);
      setError(
        `Failed to save cocktail: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper className={styles.form} elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? "Edit Cocktail" : "Add New Cocktail"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid sx={{ gridColumn: "span 12" }}>
            <TextField
              fullWidth
              label="Cocktail Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!errors.name}
              helperText={errors.name}
              disabled={submitting}
            />
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
            <FormControl
              fullWidth
              error={!!errors.glass}
              required
              disabled={submitting}
            >
              <InputLabel id="glass-select-label">Glass Type</InputLabel>
              <Select
                labelId="glass-select-label"
                value={glass}
                onChange={(e) => setGlass(e.target.value)}
                label="Glass Type"
                className={styles.glassTypeSelect}
              >
                <MenuItem value="" disabled>
                  Select a glass type
                </MenuItem>
                {glassOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors.glass && <FormHelperText>{errors.glass}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
            <FormControl
              fullWidth
              error={!!errors.alcoholic}
              required
              disabled={submitting}
            >
              <InputLabel id="alcoholic-select-label">Type</InputLabel>
              <Select
                labelId="alcoholic-select-label"
                className={styles.glassTypeSelect}
                value={alcoholic}
                onChange={(e) => setAlcoholic(e.target.value)}
                label="Type"
              >
                <MenuItem value="" disabled>
                  Select type
                </MenuItem>
                {alcoholicOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors.alcoholic && (
                <FormHelperText>{errors.alcoholic}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid sx={{ gridColumn: "span 12" }}>
            <TextField
              fullWidth
              label="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
            />
          </Grid>

          <Grid sx={{ gridColumn: "span 12" }}>
            <Box sx={{ mt: 1 }}>
              <input
                type="file"
                accept="image/*"
                id="cocktail-image-upload"
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={submitting}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  htmlFor="cocktail-image-upload"
                  disabled={submitting}
                  startIcon={<FileUpload />}
                >
                  Upload Image
                </Button>

                {selectedFile && (
                  <Typography variant="body2" color="textSecondary">
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>

              {previewUrl && (
                <Box sx={{ mt: 2, maxWidth: "200px", maxHeight: "200px" }}>
                  <img
                    src={previewUrl}
                    alt="Cocktail preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Ingredients
          </Typography>
          {errors.ingredients && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mb: 1 }}
            >
              {errors.ingredients}
            </Typography>
          )}

          {ingredients.map((ingredient, index) => (
            <Box key={index} className={styles.ingredientRow}>
              <TextField
                label="Ingredient"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className={styles.ingredientName}
                disabled={submitting}
                required={index === 0}
                error={index === 0 && !!errors.ingredients}
              />
              <TextField
                label="Amount"
                value={ingredient.measure}
                onChange={(e) =>
                  handleIngredientChange(index, "measure", e.target.value)
                }
                className={styles.ingredientMeasure}
                disabled={submitting}
                placeholder="e.g. 2 oz"
              />
              {index > 0 && (
                <IconButton
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={submitting}
                  className={styles.deleteButton}
                  size="medium"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddIngredient}
            disabled={submitting}
            className={styles.addButton}
            variant="outlined"
            size="small"
          >
            Add Ingredient
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid sx={{ gridColumn: "span 12" }}>
            <TextField
              fullWidth
              label="Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              multiline
              rows={4}
              error={!!errors.instructions}
              helperText={errors.instructions}
              disabled={submitting}
              placeholder="How to prepare this cocktail..."
            />
          </Grid>

          <Grid sx={{ gridColumn: "span 12" }}>
            <Box className={styles.saveButtonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !isFormValid}
                className={`${styles.saveButton} ${
                  !isFormValid ? styles.buttonDisabled : ""
                }`}
                startIcon={submitting ? null : <LocalBarIcon />}
              >
                {submitting ? "Saving..." : "Save Cocktail"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          className={styles.flashSuccessAlert}
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
          }}
          sx={{ width: "100%" }}
        >
          {isEditMode
            ? "Cocktail updated successfully!"
            : "Cocktail saved successfully!"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CocktailForm;

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { useNavigate } from "react-router-dom";

import { Cocktail } from "../../shared/types";
import styles from "./CocktailCard.module.scss";

type CocktailCardProps = {
  cocktail: Cocktail;
};

const CocktailCard = ({ cocktail }: CocktailCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${cocktail.id}`);
  };

  const hasValidImage =
    cocktail.image &&
    !cocktail.image.includes("placeholder") &&
    !cocktail.image.endsWith("null") &&
    !cocktail.image.endsWith("undefined");

  return (
    <Card className={styles.card}>
      <CardActionArea onClick={handleClick}>
        {hasValidImage ? (
          <CardMedia
            component="img"
            height="180"
            image={cocktail.image}
            alt={cocktail.name}
            className={styles.media}
          />
        ) : (
          <Box className={styles.placeholderContainer}>
            <LocalBarIcon className={styles.placeholderIcon} />
            <Typography variant="body2" className={styles.placeholderText}>
              No Image Available
            </Typography>
          </Box>
        )}
        <CardContent className={styles.content}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className={styles.title}
          >
            {cocktail.name}
          </Typography>
          <div className={styles.tags}>
            {cocktail.isCustom && (
              <Chip
                label="Custom"
                color="primary"
                variant="outlined"
                size="small"
                className={styles.chip}
              />
            )}
            {cocktail.alcoholic && (
              <Chip
                label={cocktail.alcoholic}
                color="default"
                variant="outlined"
                size="small"
                className={styles.chip}
              />
            )}
          </div>
          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.glass}
          >
            {cocktail.glass}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CocktailCard;

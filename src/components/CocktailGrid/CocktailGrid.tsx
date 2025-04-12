import React, { useEffect, useState } from "react";
import {
  Grid,
  Pagination,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import CocktailCard from "../CocktailCard/CocktailCard";
import { Cocktail } from "../../shared/types";
import { PAGE_SIZE } from "../../shared/constants";
import styles from "./CocktailGrid.module.scss";

type CocktailGridProps = {
  cocktails: Cocktail[];
  loading: boolean;
  error: string | null;
  title?: string;
};

const CocktailGrid = ({
  cocktails,
  loading,
  error,
  title = "Cocktails",
}: CocktailGridProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [cocktails]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(cocktails.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const displayedCocktails = cocktails.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (loading) {
    return (
      <Box className={styles.loaderContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.messageContainer}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (cocktails.length === 0) {
    return (
      <Box className={styles.messageContainer}>
        <Typography variant="h6">Search for cocktails or add some.</Typography>
      </Box>
    );
  }

  return (
    <div className={styles.container}>
      {title && (
        <Typography variant="h4" className={styles.title}>
          {title}
        </Typography>
      )}

      <Grid container spacing={3} className={styles.grid}>
        {displayedCocktails.map((cocktail) => (
          <Grid
            sx={{
              gridColumn: {
                xs: "span 12",
                sm: "span 6",
                md: "span 4",
                lg: "span 3",
              },
            }}
            key={cocktail.id}
          >
            <CocktailCard cocktail={cocktail} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </div>
  );
};

export default CocktailGrid;

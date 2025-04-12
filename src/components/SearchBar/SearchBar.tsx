import React, { useState, useEffect } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./SearchBar.module.scss";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChange,
  loading = false,
  placeholder = "Search cocktails...",
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <Paper className={styles.container}>
      <InputBase
        className={styles.input}
        placeholder={placeholder}
        inputProps={{ "aria-label": placeholder }}
        value={inputValue}
        onChange={handleChange}
      />
      <Box className={styles.iconContainer}>
        {loading ? (
          <CircularProgress size={24} className={styles.loader} />
        ) : inputValue ? (
          <IconButton
            type="button"
            aria-label="clear"
            onClick={handleClear}
            className={styles.iconButton}
          >
            <ClearIcon />
          </IconButton>
        ) : null}
        <IconButton
          type="submit"
          aria-label="search"
          className={styles.iconButton}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SearchBar;

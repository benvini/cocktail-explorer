import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LocalBarIcon from "@mui/icons-material/LocalBar";

import styles from "./Header.module.scss";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Add New Cocktail", path: "/add" },
  ];

  const handleDrawerToggle = () => {
    setMobileMenuOpen((prevOpen) => !prevOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" className={styles.appBar} color="default">
      <Toolbar disableGutters className={styles.toolbar}>
        <RouterLink to="/" className={styles.logoLink}>
          <Box className={styles.logo}>
            <LocalBarIcon className={styles.logoIcon} />
            <Typography variant="h6" noWrap className={styles.logoText}>
              Cocktail Explorer
            </Typography>
          </Box>
        </RouterLink>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={styles.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={handleDrawerToggle}
            >
              <Box
                role="presentation"
                onClick={handleDrawerToggle}
                onKeyDown={handleDrawerToggle}
                className={styles.drawerContainer}
              >
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={item.path}
                        selected={isActive(item.path)}
                      >
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box className={styles.navItems}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                color="inherit"
                className={`${styles.navButton} ${
                  isActive(item.path) ? styles.active : ""
                }`}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

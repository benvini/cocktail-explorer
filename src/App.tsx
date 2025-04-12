import { ThemeProvider } from "@mui/material";

import Navigation from "./navigation/Navigation";
import theme from "./theme/theme";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Navigation />
    </ThemeProvider>
  );
};

export default App;

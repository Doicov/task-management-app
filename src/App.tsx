import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import Home from "./pages/Home";

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#c8d4ef',
      contrastText: '#f1f1f1',
    },
    secondary: {
      light: 'rgb(228, 228, 228)',
      main: 'rgb(59, 170, 64)',
      dark: '#3e9342',
      contrastText: '#f1f1f1',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider  theme={theme}>
      <Home />
    </ThemeProvider >

  );
};

export default App;

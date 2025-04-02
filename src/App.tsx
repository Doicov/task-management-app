import { createTheme, ThemeProvider } from "@mui/material";
// import Home from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FolderList from "./components/FolderList";
import FolderPage from "./components/FolderPage";
import { Provider } from "urql";
import { client } from "./api/client";


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

const App = () => {

  return (
    <Provider value={client}>
    <ThemeProvider  theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/folders" replace />} />
          <Route path="/folders" element={<FolderList />} />
          <Route path="/folders/:folderId" element={<FolderPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider >
    </Provider>
  );
};

export default App;

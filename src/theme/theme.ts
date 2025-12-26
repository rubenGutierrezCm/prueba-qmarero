/**
 * Material-UI theme configuration
 * Defines custom color palette and styling for the application
 */
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8b9bef",
      dark: "#4d5fc7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#9570b8",
      dark: "#5a3a7d",
      contrastText: "#ffffff",
    },
  },
});

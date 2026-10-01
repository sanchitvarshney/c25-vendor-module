import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0d9488", dark: "#0f766e", light: "#2dd4bf", contrastText: "#fff" },
    secondary: { main: "#475569" },
    background: { default: "#f4f6f9", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "#e2e8f0",
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    fontSize: 13,
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f4f6f9" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderColor: "#e2e8f0" } },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});

export default theme;

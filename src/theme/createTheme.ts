import type { PaletteMode, Theme } from "@mui/material";
import { createTheme } from "@mui/material";
import { muiComponentsProps } from "./muiComponents";
import { ColorPalette, themeConfig } from "./themeConfig";

/**
 * Creates a custom MUI theme based on provided primary color, background color, and palette mode.
 */
export const createCustomTheme = (
  primaryColor: string,
  backgroundColor = "#232e58",
  mode: PaletteMode = "dark",
): Theme => {
  return createTheme({
    components: {
      ...muiComponentsProps,
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "12px",
            fontWeight: 600,
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            backgroundImage: "none", // Remove default gradient overlay in dark mode
          },
          elevation1: {
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.05)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "24px",
          },
        },
      },
    },
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: backgroundColor,
      },
      warning: {
        main: mode === "dark" ? ColorPalette.orange : ColorPalette.orangeDark,
      },
      info: {
        main: ColorPalette.blue,
      },
      error: {
        main: ColorPalette.red,
      },
      // background: {
      //   default: backgroundColor,
      //   paper: mode === "dark" ? ColorPalette.charcoal : ColorPalette.lightMode,
      // },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#1e293b",
        secondary: mode === "dark" ? "#a1a1aa" : "#64748b",
      },
      mode,
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 16,
    },
  }) as unknown as Theme;
};

/**
 * List of available themes with their name and corresponding MUI theme object.
 */
export const Themes: { name: string; MuiTheme: Theme }[] = Object.entries(themeConfig).map(
  ([name, config]) => ({
    name,
    MuiTheme: createCustomTheme(config.primaryColor, config.secondaryColor),
  }),
);

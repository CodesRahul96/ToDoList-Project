import { Global, css, useTheme } from "@emotion/react";
import { reduceMotion } from "./reduceMotion.styled";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export const GlobalStyles = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);

  const reduceMotionSetting = user?.settings?.reduceMotion ?? "system";
  const prefersReducedMotion = usePrefersReducedMotion(reduceMotionSetting);

  return (
    <Global
      styles={css`
        * {
          font-family: "Poppins", sans-serif !important;
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
          &::selection {
            background-color: ${theme.primary}40;
            color: inherit;
          }
        }
        :root {
          font-family: "Poppins", sans-serif;
          line-height: 1.5;
          font-weight: 400;
          color-scheme: ${theme.darkmode ? "dark" : "light"};
          color: ${theme.text.primary};
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
          --rsbs-backdrop-bg: rgba(0, 0, 0, 0.3);
          --rsbs-bg: ${theme.darkmode ? "#1e1e1e" : "#ffffff"};
        }
        .no-transition *,
        .no-transition *::before,
        .no-transition *::after {
          transition: none !important;
        }
        input[type="datetime-local"]:placeholder-shown {
          color: transparent !important;
        }
        img {
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -o-user-select: none;
          user-select: none;
        }
        a {
          text-decoration: none;
          -webkit-text-decoration: none;
          color: inherit;
        }
        div[role="dialog"] {
          border-radius: 24px 24px 0 0;
          z-index: 9999999;
        }
        div[data-rsbs-backdrop] {
          z-index: 999;
        }
        div[data-rsbs-header] {
          z-index: 999999;
          &::before {
            width: 48px;
            height: 4px;
            border-radius: 100px;
            background: ${theme.darkmode ? "#525252" : "#e2e8f0"};
            margin-top: 8px;
          }
        }
        div[data-rsbs-header] {
          box-shadow: none;
        }
        [data-rsbs-root] {
          ${prefersReducedMotion &&
          css`
            --rsbs-animation-duration: 0ms !important;
            --rsbs-backdrop-opacity: 1 !important;
          `}
        }
        [data-rsbs-root],
        [data-rsbs-root] * {
          ${reduceMotion(theme, {
            transform: "none !important",
            willChange: "auto !important",
            scrollBehavior: "auto",
          })};
        }
        body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          touch-action: manipulation;
          background: ${theme.secondary};
          background-attachment: fixed;
          background-size: cover;
          transition: 0.3s background;
          color: ${theme.text.primary};

          /* Custom Scrollbar Styles */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background-color: ${theme.darkmode ? "#ffffff20" : "#00000020"};
            border-radius: 20px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: ${theme.darkmode ? "#ffffff40" : "#00000040"};
          }
        }

        pre {
          background-color: #1e1e1e;
          color: #e2e8f0;
          padding: 16px;
          border-radius: 12px;
          overflow-x: auto;
          border: 1px solid #333;
        }
        // EMOJI PICKER REACT STYLES (Modernized)
        .EmojiPickerReact {
          --epr-search-border-color: ${theme.darkmode ? "#333" : "#e2e8f0"} !important;
          --epr-bg-color: ${theme.darkmode ? "#1e1e1e" : "#ffffff"} !important;
          --epr-category-label-bg-color: ${theme.darkmode ? "#1e1e1e" : "#ffffff"} !important;
          --epr-text-color: ${theme.text.primary} !important;
          --epr-hover-bg-color: ${theme.primary}20 !important;
          --epr-focus-bg-color: ${theme.primary}20 !important;
          border-radius: 16px !important;
          border: 1px solid ${theme.darkmode ? "#333" : "#e2e8f0"} !important;
          box-shadow: none !important;
        }
        
        .epr-search {
            background-color: ${theme.darkmode ? "#2d2d2d" : "#f1f5f9"} !important;
            border: 1px solid transparent !important;
             &:focus {
                border-color: ${theme.primary} !important;
             }
        }

        .epr-emoji-category-label {
           font-family: inherit !important;
           font-weight: 600 !important;
           color: ${theme.text.secondary} !important;
        }

        // QR CODE SCANNER STYLES
        .scanner-container div[style*="border: 2px dashed"] {
          border-color: ${theme.primary}66 !important;
        }
        // ... (Keep generic scanner styles or refine if needed)
        
        // MATERIAL UI STYLES
        .MuiDialog-paper {
            background-color: ${theme.darkmode ? "#1e1e1e" : "#ffffff"} !important;
            border: 1px solid ${theme.darkmode ? "#333" : "transparent"};
        }
        
        .MuiDialog-container {
          backdrop-filter: blur(4px);
        }
        
        .MuiTooltip-tooltip {
          background-color: ${theme.darkmode ? "#333" : "#1e293b"} !important;
          color: #fff !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          ${reduceMotion(theme)}
        }
      `}
    />
  );
};

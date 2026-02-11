export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#f0f0f0",
  darkMode: "#121212", // Deeper, more standard dark mode background
  lightMode: "#ffffff", // Clean white
  purple: "#b624ff",
  red: "#ff3131",
  orange: "#ff9318",
  orangeDark: "#ff9500",
  blue: "#29b6f6",
  // New Professional Shades
  charcoal: "#1e1e1e",
  offWhite: "#f5f5f7",
  slate: "#475569",
} as const satisfies Record<string, string>;

export const themeConfig: { [key: string]: { primaryColor: string; secondaryColor?: string } } = {
  "Dark Purple": {
    primaryColor: ColorPalette.purple,
    secondaryColor: "#0f0e13", // Slightly richer dark background
  },
  "Light Purple": {
    primaryColor: ColorPalette.purple,
    secondaryColor: "#f3f4f6", // Soft gray-white
  },
  "Dark Blue": {
    primaryColor: "#3b82f6", // Modern Blue
    secondaryColor: "#0f172a", // Slate-900
  },
  "Light Blue": {
    primaryColor: "#0ea5e9", // Sky-500
    secondaryColor: "#f0f9ff", // Sky-50
  },
  "Dark Pink": {
    primaryColor: "#ec4899", // Pink-500
    secondaryColor: "#1f1016",
  },
  "Light Pink": {
    primaryColor: "#db2777", // Pink-600
    secondaryColor: "#fdf2f8", // Pink-50
  },
  "Blush Blossom": {
    primaryColor: "#f43f5e", // Rose-500
    secondaryColor: "#fff1f2", // Rose-50
  },
  Cheesecake: {
    primaryColor: "#e11d48", // Rose-600
    secondaryColor: "#fffbe6", // Warm white
  },
  "Mystic Coral": {
    primaryColor: "#f87171", // Red-400
    secondaryColor: "#2a0a10",
  },
  "Dark Orange": {
    primaryColor: "#f97316", // Orange-500
    secondaryColor: "#0c0a09", // Stone-950
  },
  "Light Orange": {
    primaryColor: "#ea580c", // Orange-600
    secondaryColor: "#fff7ed", // Orange-50
  },
  Aurora: {
    primaryColor: "#10b981", // Emerald-500
    secondaryColor: "#022c22", // Emerald-950
  },
  "Pitch Black": {
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
  },
};

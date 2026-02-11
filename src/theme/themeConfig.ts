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
  "Modern Blue": {
    primaryColor: "#0961FB", // High-end executive blue
    secondaryColor: "#F8FAFC", // Clean slate-50
  },
  "Midnight Slate": {
    primaryColor: "#38bdf8", // Sky-400
    secondaryColor: "#080E1E", // Deeper, more modern slate
  },
  "Emerald Grove": {
    primaryColor: "#059669", // Pro Emerald
    secondaryColor: "#F0FDF4", // Emerald-50
  },
  "Deep Emerald": {
    primaryColor: "#10B981", // Emerald-500
    secondaryColor: "#021A15", // Deepest night emerald
  },
  "Royal Purple": {
    primaryColor: "#7C3AED", // Modern Violet
    secondaryColor: "#F5F3FF", // Violet-50
  },
  "Abyssal Violet": {
    primaryColor: "#8B5CF6", // Violet-500
    secondaryColor: "#0A0B1E", // Abyss night
  },
  "Crimson Velvet": {
    primaryColor: "#DC2626", // Professional Red
    secondaryColor: "#FFF1F2", // Rose-50
  },
  "Onyx Rose": {
    primaryColor: "#FB7185", // Rose-400
    secondaryColor: "#0F0A0B", // Dark velvet
  },
  "Sunset Glow": {
    primaryColor: "#EA580C", // Vibrant Orange
    secondaryColor: "#FFF7ED", // Orange-50
  },
  "Volcanic Ember": {
    primaryColor: "#F97316", // Orange-500
    secondaryColor: "#110E0D", // Volcanic dark
  },
  "Pure Minimalist": {
    primaryColor: "#0F172A", // Slate-900 icon
    secondaryColor: "#FFFFFF", // Pure white
  },
  "Pitch Black": {
    primaryColor: "#F1F5F9", // Slate-100 icon
    secondaryColor: "#000000", // True black
  },
};


import React, { createContext, useContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: "light";
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  // For the MVP, we're only supporting light theme
  const value = {
    theme: "light" as const,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

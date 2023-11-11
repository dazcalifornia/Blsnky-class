"use client";
import { useState } from "react";
import { createContext, ReactNode, useContext } from "react";
import { ThemeConfig } from "antd";

interface ThemeContextProps {
  theme: ThemeConfig;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: ThemeConfig;
}

export const ThemeProvider = ({
  children,
  initialTheme,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    // Implement your logic to toggle between themes based on the token algorithm
    // For simplicity, let's just switch between light and dark themes
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Default light and dark themes
const lightTheme: ThemeConfig = {
  // Define your light theme properties here
  token: {
    colorBgBase: "#f5faf9",
    colorLink: "#ffdd00",
    colorTextBase: "#007979",
    wireframe: false,
    colorPrimary: "#13c2c2",
    colorInfo: "#13c2c2",
    fontSize: 16,
    borderRadius: 16,
  },
};

const darkTheme: ThemeConfig = {
  // Define your dark theme properties here
  token: {
    colorBgBase: "#182d3b",
    colorLink: "#ffdd00",
    colorPrimary: "#13c2c2",
    colorInfo: "#00ffc7",
    colorTextBase: "#ffffff",
    wireframe: false,
    borderRadius: 16,
  },
};

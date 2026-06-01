import { useState, useEffect } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof localStorage === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Check system preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    // Legacy cleanup: remove global dark-theme class from document.documentElement
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark-theme");
    }

    const handleThemeChange = () => {
      const saved = localStorage.getItem("theme");
      if (saved) {
        setIsDarkMode(saved === "dark");
      }
    };

    window.addEventListener("theme-change", handleThemeChange);
    
    // Sync initial state from localStorage or system preference
    const saved = localStorage.getItem("theme");
    if (!saved && typeof window !== "undefined") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
    }

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDarkMode(nextDark);
    window.dispatchEvent(new Event("theme-change"));
  };

  return { isDarkMode, toggleTheme };
}


import { useState } from "react";

const THEME_STORAGE_KEY = "moodify-theme";

export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light"
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return { theme, toggleTheme };
}

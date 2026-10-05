import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return children;
}

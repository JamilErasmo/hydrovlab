"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NavigationTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("navigationHistory")) || [];
    
    if (history[history.length - 1] !== pathname) {
      history.push(pathname);
      if (history.length > 10) history.shift(); // Limita a 10 páginas
      localStorage.setItem("navigationHistory", JSON.stringify(history));
    }
  }, [pathname]);

  return null;
};

export default NavigationTracker;

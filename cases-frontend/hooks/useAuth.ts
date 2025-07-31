"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const auth = document.cookie.includes("auth=true");
    setIsAuthenticated(auth);
  }, [pathname]); // 👈 update whenever path changes

  return isAuthenticated;
}

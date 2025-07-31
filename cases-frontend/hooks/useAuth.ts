"use client";

import { useEffect, useState } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const auth = document.cookie.includes("auth=true");
        setIsAuthenticated(auth);
    }, []);

    return isAuthenticated;
}

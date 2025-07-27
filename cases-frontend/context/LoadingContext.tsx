'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { loadingRef } from '@/lib/loadingStore';

const LoadingContext = createContext<{ loading: boolean }>({ loading: false });

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadingRef.subscribe(setLoading);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
};

'use client';

import { useLoading } from '@/context/LoadingContext';
import { useEffect, useState } from 'react';

export default function LoadingBar() {
  const { loading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      setVisible(true);
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + Math.floor(Math.random() * 10) + 1;
          return prev;
        });
      }, 150);
    } else {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex flex-col items-center justify-center text-white">
      <div className="w-64 bg-white/90 rounded-full h-4 overflow-hidden shadow-lg">
        <div
          className="bg-blue-600 h-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-white text-lg font-semibold">{progress}%</p>
    </div>
  );
}

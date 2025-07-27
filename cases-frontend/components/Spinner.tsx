'use client';

export default function Spinner() {
  return (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-medium">Loading...</p>
  </div>
  );
}



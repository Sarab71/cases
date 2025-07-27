'use client';

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin shadow-lg"></div>
    </div>
  );
}

'use client';

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 bg-opacity-30 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

'use client';

import LoadingBar from '@/components/LoadingBar'; // adjust the path if needed
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingBar />}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-white hover:cursor-pointer hover:underline"
      >
        Logout
      </button>
    </>
  );
}

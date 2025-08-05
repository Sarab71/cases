import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const isAuthenticated = useAuth();
  if (isAuthenticated === false || isAuthenticated === null) {
    return null;
  }

  return (
    <header className="bg-blue-700 text-white shadow-md p-4 flex justify-center items-center">
      <nav className="space-x-4 flex justify-center">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/add-customer" className="hover:underline">Add Customer</Link>
        <Link href="/add-payment" className="hover:underline">Add Payment</Link>
        <Link href="/expenses" className="hover:underline">Expenses</Link>
        <Link href="/create-bill" className="hover:underline">Create Bill</Link>
        <Link href="/customers" className="hover:underline">Customers</Link>
        <Link href="/due-date" className="hover:underline">Sales</Link>
        <LogoutButton />

      </nav>
    </header>
  );
}
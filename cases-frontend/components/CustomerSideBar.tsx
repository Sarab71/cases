'use client';

import { useEffect, useState } from 'react';

interface Customer {
  id: string;
  name: string;
}

interface CustomerSideBarProps {
  onSelectCustomer: (customerId: string, customerName: string) => void;
}

export default function CustomerSideBar({ onSelectCustomer }: CustomerSideBarProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers`);
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-blue-700 p-4 overflow-y-auto shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Customers</h2>
      <ul className="space-y-2">
        {customers.map((customer) => (
          <li key={customer.id}>
            <button
              onClick={() => onSelectCustomer(customer.id, customer.name)}
              className="block w-full text-left p-2 bg-blue-500 rounded text-white hover:bg-blue-400 transition hover:cursor-pointer"
            >
              {customer.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

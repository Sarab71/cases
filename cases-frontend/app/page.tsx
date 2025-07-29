"use client";

import { useState, useEffect } from 'react';
import TotalOutstanding from '@/components/TotalOutstanding';
import PaymentsReceived from '@/components/PaymentsReceived';
import TotalSales from '@/components/TotalSales';
import TotalExpenses from '@/components/TotalExpenses';
import TodayDueSidebar from '@/components/TodayDueSideBar';
import axios from '@/lib/axios';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    async function fetchTotals() {
      const params = new URLSearchParams();

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        params.append('startDate', start.toISOString());
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.append('endDate', end.toISOString());
      }

      try {
        const [salesRes, paymentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales/total?${params}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/total?${params}`),
        ]);

        setTotalSales(salesRes.data.totalSales || 0);
        setTotalPayments(paymentsRes.data.totalPayment || 0);
      } catch (err) {
        console.error('Failed to fetch totals:', err);
      }
    }

    fetchTotals();
  }, [startDate, endDate]);

  const totalOutstanding = totalSales - totalPayments;

  return (
    <div className="flex">
      {/* Sidebar */}
      <TodayDueSidebar />

      {/* Main Content */}
      <main className="ml-64 p-4 w-full">
        <h1 className="text-center text-2xl font-bold mb-2">Welcome to the Billing System</h1>
        <p className="text-center mb-8">Manage your bills and payments efficiently.</p>

        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border rounded p-1"
              max={endDate || undefined}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border rounded p-1"
              min={startDate || undefined}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <TotalOutstanding value={totalOutstanding} />
          <PaymentsReceived value={totalPayments} />
          <TotalSales value={totalSales} />
          <TotalExpenses startDate={startDate} endDate={endDate} />
        </div>
      </main>
    </div>
  );
}

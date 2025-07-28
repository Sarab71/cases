'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { format } from 'date-fns';

import TotalSales from '@/components/TotalSales';
import TotalExpenses from '@/components/TotalExpenses';
import PaymentsReceived from '@/components/PaymentsReceived';
import TotalOutstanding from '@/components/TotalOutstanding';
import TodayDueSideBar from '@/components/TodayDueSideBar';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    totalSales: null,
    totalExpenses: null,
    totalPayment: null,
    totalOutstanding: null,
    dueBills: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (startDate) {
        params.append('startDate', new Date(startDate).toISOString());
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.append('endDate', end.toISOString());
      }

      const today = format(new Date(), 'yyyy-MM-dd');

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const [
          salesRes,
          expensesRes,
          paymentsRes,
          outstandingRes,
          dueBillsRes,
        ] = await Promise.all([
          axios.get(`${baseUrl}/api/sales/total?${params.toString()}`),
          axios.get(`${baseUrl}/api/expenses/total?${params.toString()}`),
          axios.get(`${baseUrl}/api/payments/total?${params.toString()}`),
          axios.get(`${baseUrl}/api/customers/outstanding?${params.toString()}`),
          axios.get(`${baseUrl}/api/bills/by-due-date?date=${today}`),
        ]);

        setData({
          totalSales: salesRes.data.totalSales,
          totalExpenses: expensesRes.data.totalExpenses,
          totalPayment: paymentsRes.data.totalPayment,
          totalOutstanding: outstandingRes.data.totalOutstanding,
          dueBills: dueBillsRes.data,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [startDate, endDate]);

  if (loading) return <div className="text-center py-4">Loading dashboard...</div>;

  return (
    <div className="ml-64 p-4"> {/* leave space for the fixed sidebar */}
      {/* 🔵 Date Filters Centered */}
      <div className="flex justify-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-center">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-center">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* 🔵 Compact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 bg-white rounded shadow-sm text-sm">
          <TotalSales total={data.totalSales} />
        </div>
        <div className="p-3 bg-white rounded shadow-sm text-sm">
          <TotalExpenses total={data.totalExpenses} />
        </div>
        <div className="p-3 bg-white rounded shadow-sm text-sm">
          <PaymentsReceived total={data.totalPayment} />
        </div>
        <div className="p-3 bg-white rounded shadow-sm text-sm">
          <TotalOutstanding total={data.totalOutstanding} />
        </div>
      </div>

      {/* 🔵 Fixed Sidebar */}
      <TodayDueSideBar bills={data.dueBills} />
    </div>
  );
}

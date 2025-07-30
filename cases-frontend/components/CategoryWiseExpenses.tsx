'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface CategoryWithExpenses {
  id: string;
  name: string;
  expenses: Expense[];
}

export default function CategoryWiseExpenses() {
  const [data, setData] = useState<CategoryWithExpenses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesRes = await axios.get('/expenses/categories');
        const categories = categoriesRes.data;

        const allData: CategoryWithExpenses[] = await Promise.all(
          categories.map(async (cat: any) => {
            const expensesRes = await axios.get(`/expenses/category/${cat.id}`); // ✅ Fixed here
            return {
              id: cat.id,
              name: cat.name,
              expenses: expensesRes.data,
            };
          })
        );


        setData(allData);
      } catch (err) {
        toast.error('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  if (data.length === 0) return <p className="p-4">No categories found.</p>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-4">Expenses by Category</h2>

      {data.map(category => (
        <div key={category.id} className="border rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-bold mb-2">{category.name}</h3>

          {category.expenses.length === 0 ? (
            <p className="text-gray-500">No expenses</p>
          ) : (
            <ul className="divide-y">
              {category.expenses.map(exp => (
                <li key={exp.id} className="py-2 flex justify-between text-sm">
                  <span>{exp.description}</span>
                  <span>₹{exp.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 text-right font-semibold">
            Total: ₹{category.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

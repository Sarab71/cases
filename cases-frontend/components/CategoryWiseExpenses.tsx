'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

interface CategoryWiseExpensesProps {
  refreshTrigger?: number;
}
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

export default function CategoryWiseExpenses({ refreshTrigger }: CategoryWiseExpensesProps) {
  const [data, setData] = useState<CategoryWithExpenses[]>([]);
  const [loading, setLoading] = useState(true);
  const [localTrigger, setLocalTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const categoriesRes = await axios.get('/expenses/categories');
        const categories = categoriesRes.data;

        const allData: CategoryWithExpenses[] = await Promise.all(
          categories.map(async (cat: any) => {
            const expensesRes = await axios.get(`/expenses/category/${cat.id}`);
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
  }, [refreshTrigger, localTrigger]);

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      setLocalTrigger(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`/expenses/categories/${id}`);
      toast.success('Category deleted');
      setLocalTrigger(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (data.length === 0) return <p className="p-4">No categories found.</p>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold mb-4">Expenses by Category</h2>

      {data.map(category => (
        <div key={category.id} className="border rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{category.name}</h3>
            <button
              className="text-red-500 text-sm hover:underline cursor-pointer"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Delete Category
            </button>
          </div>

          {category.expenses.length === 0 ? (
            <p className="text-gray-500">No expenses</p>
          ) : (
            <ul className="divide-y">
              {category.expenses.map(exp => (
                <li key={exp.id} className="py-2 flex justify-between text-sm items-center">
                  <span>{exp.date}</span>
                  <span>{exp.description}</span>
                  <span>₹{exp.amount.toFixed(2)}</span>
                  <button
                    className="text-xs text-red-500 hover:underline ml-4 cursor-pointer"
                    onClick={() => handleDeleteExpense(exp.id)}
                  >
                    Delete
                  </button>
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
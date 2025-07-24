'use client';

import { useEffect, useState } from 'react';

interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
}

interface Category {
    id: string;
    category: string;
    expenses: Expense[];
}

export default function ExpensesList() {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchExpenses = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses`);
        if (res.ok) {
            const data = await res.json();
            setCategories(data);
        }
    };

    const handleDelete = async (category: string, index: number) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        const params = new URLSearchParams({ category, index: index.toString() });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expenses?${params.toString()}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchExpenses();  // Refresh list after delete
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Expenses</h2>
            {categories.map(category => (
                <div key={category.id} className="mb-6">
                    <h3 className="text-lg font-semibold">{category.category}</h3>
                    <ul>
                        {category.expenses.map((expense, index) => (
                            <li key={expense.id} className="flex justify-between items-center border-b py-1">
                                <div>
                                    <p>{expense.description} - ₹{expense.amount}</p>
                                    <small>{new Date(expense.date).toLocaleDateString()}</small>
                                </div>
                                <button
                                    onClick={() => handleDelete(category.category, index)}
                                    className="text-red-500 hover:underline text-sm cursor-pointer"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

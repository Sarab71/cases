'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

interface ExpenseCategory {
  id: string;
  name: string;
}

export default function CreateExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [filtered, setFiltered] = useState<ExpenseCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get('/api/expenses/categories')
      .then(res => setCategories(res.data))
      .catch(err => toast.error('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (categoryInput.trim() === '') {
      setFiltered([]);
      return;
    }
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(categoryInput.toLowerCase())
    );
    setFiltered(filtered);
    setShowDropdown(true);
  }, [categoryInput, categories]);

  const handleCategorySelect = (cat: ExpenseCategory) => {
    setCategoryInput(cat.name);
    setSelectedCategoryId(cat.id);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !selectedCategoryId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await axios.post('/expenses', {
        description,
        amount: parseFloat(amount),
        date: date || null,
        categoryId: selectedCategoryId
      });

      toast.success('Expense created');
      // Reset
      setDescription('');
      setAmount('');
      setDate('');
      setCategoryInput('');
      setSelectedCategoryId(null);
    } catch (err) {
      toast.error('Failed to create expense');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow max-w-md">
      <h2 className="text-xl font-semibold">Create Expense</h2>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="relative">
        <input
          type="text"
          placeholder="Category"
          value={categoryInput}
          onChange={e => {
            setCategoryInput(e.target.value);
            setSelectedCategoryId(null);
          }}
          className="w-full border p-2 rounded"
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto">
            {filtered.map(cat => (
              <li
                key={cat.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCategorySelect(cat)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}

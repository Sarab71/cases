'use client';

import React from 'react';
import CategoryWiseExpenses from '@/components/CategoryWiseExpenses';
import ExpenseForm from '@/components/ExpenseForm';
import CreateExpenseCategoryForm from '@/components/CreateExpenseCategoryForm';

const Page = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      <div className="grid gap-6">
        {/* Category Creation Form */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Create Expense Category</h2>
          <CreateExpenseCategoryForm />
        </div>

        {/* Expense Entry Form */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Add New Expense</h2>
          <ExpenseForm />
        </div>

        {/* Category-wise Expenses */}
        <div>
          <CategoryWiseExpenses />
        </div>
      </div>
    </div>
  );
};

export default Page;

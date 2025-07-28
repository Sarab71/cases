'use client';

interface TotalExpensesProps {
total: number | null;
}

export default function TotalExpenses({total}: TotalExpensesProps) {
    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Expenses</h3>
            <div className="text-2xl font-bold text-orange-600">
                ₹ {typeof total === 'number' ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

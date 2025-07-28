'use client';

interface TotalSalesProps {
  total: number | null;
}

export default function TotalSales({ total }: TotalSalesProps) {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Total Sales</h3>
      <div className="text-2xl font-bold text-blue-600">
        ₹ {typeof total === 'number' ? total.toLocaleString() : '...'}
      </div>
    </div>
  );
}

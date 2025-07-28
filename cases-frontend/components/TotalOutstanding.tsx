'use client';

interface TotalOutstandingProps {
total: number | null;
}

export default function TotalOutstanding({ total }: TotalOutstandingProps) {

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Total Outstanding</h3>
            <div className="text-2xl font-bold text-red-600">
                ₹ {total !== null ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

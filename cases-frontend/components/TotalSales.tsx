'use client';

import { useEffect, useState } from 'react';

interface TotalSalesProps {
    startDate?: string;
    endDate?: string;
}

export default function TotalSales({ startDate = '', endDate = '' }: TotalSalesProps) {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTotal() {
            const params = new URLSearchParams();

            if (startDate) {
                const start = new Date(startDate);
                params.append('startDate', start.toISOString());
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // ✅ include full end day
                params.append('endDate', end.toISOString());
            }

            console.log('🔍 Params:', params.toString()); // debug line

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales/total?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTotal(data.totalSales);
            } else {
                console.error('API failed:', res.status);
            }
        }

        fetchTotal();
    }, [startDate, endDate]);

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Total Sales</h3>
            <div className="text-2xl font-bold text-blue-600">
                ₹ {typeof total === 'number' ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

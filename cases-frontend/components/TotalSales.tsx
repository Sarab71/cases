'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

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

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sales/total?${params.toString()}`
                );
                setTotal(res.data.totalSales);
            } catch (error) {
                console.error('API failed:', error);
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

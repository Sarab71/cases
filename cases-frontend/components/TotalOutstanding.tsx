'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

interface TotalOutstandingProps {
    startDate?: string;
    endDate?: string;
}

export default function TotalOutstanding({ startDate = '', endDate = '' }: TotalOutstandingProps) {
    const [total, setTotal] = useState<number | null>(null);


    useEffect(() => {
        async function fetchTotal() {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/outstanding?${params.toString()}`
                );
                setTotal(res.data.totalOutstanding);
            } catch (error) {
                console.error('Error fetching total outstanding:', error);
            }
        }

        fetchTotal();
    }, [startDate, endDate]);

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Total Outstanding</h3>
            <div className="text-2xl font-bold text-red-600">
                ₹ {total !== null ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

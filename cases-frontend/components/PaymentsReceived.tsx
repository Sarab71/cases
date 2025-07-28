'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

interface PaymentsReceivedProps {
    startDate?: string;
    endDate?: string;
}

export default function PaymentsReceived({ startDate = '', endDate = '' }: PaymentsReceivedProps) {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTotal() {
            const params = new URLSearchParams();

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                params.append('startDate', start.toISOString());
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                params.append('endDate', end.toISOString());
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/total?${params.toString()}`);
                setTotal(res.data.totalPayment); // ✅ fixed key
            } catch (err) {
                console.error('API failed:', err);
            }
        }

        fetchTotal();
    }, [startDate, endDate]);

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Payments Received</h3> {/* ✅ Updated heading */}
            <div className="text-2xl font-bold text-green-600">
                ₹ {typeof total === 'number' ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

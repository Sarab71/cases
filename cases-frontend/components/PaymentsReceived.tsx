'use client';
interface PaymentsReceivedProps {
total: number | null;
}

export default function PaymentsReceived({total}: PaymentsReceivedProps) {

    return (
        <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Payments Received</h3> {/* ✅ Updated heading */}
            <div className="text-2xl font-bold text-green-600">
                ₹ {typeof total === 'number' ? total.toLocaleString() : '...'}
            </div>
        </div>
    );
}

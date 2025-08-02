'use client';

import EditBillForm from '@/components/EditBillForm'; // Adjust the import path if needed
import PaymentEditForm from '@/components/PaymentEditForm';
import axios from '@/lib/axios';
import { useCallback, useEffect, useState } from 'react';

interface Transaction {
    id: string;
    date: string;
    type?: 'debit' | 'credit'; // type optional, as it may not be present
    amount?: number;
    description?: string;
    relatedBillId?: string;
    invoiceNumber?: number;
    particulars?: string;
    debit?: number;
    credit?: number;
    balance: number;
}

interface Props {
    customerId: string;
    customerName: string;
}

export default function CustomerStatement({ customerId, customerName }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${customerId}/statement`);
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleInvoiceClick = (billId?: string | null) => {
        if (billId) {
            setSelectedBillId(billId);
            setSelectedPaymentId(null); // Close payment form if open
        }
    };

    const handlePaymentClick = (paymentId?: string | null) => {
        if (paymentId) {
            setSelectedPaymentId(paymentId);
            setSelectedBillId(null); // Close bill form if open
        }
    };


    const downloadStatementPdf = async () => {
        try {
            // ✅ Convert dates in transactions to dd-mm-yyyy
            const formattedTransactions = transactions.map((tx) => ({
                ...tx,
                date: new Date(tx.date).toLocaleDateString('en-GB'), // dd-mm-yyyy format
            }));

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_PDF_API_URL}/generate-statement`,
                {
                    customerName,
                    transactions: formattedTransactions,
                },
                {
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Statement_${customerName.replace(/\s+/g, '_')}.pdf`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download statement PDF:', error);
            alert('Failed to download statement PDF');
        }
    };



    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Statement of {customerName}</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Particulars</th>
                                <th className="border p-2 text-right">Debit (₹)</th>
                                <th className="border p-2 text-right">Credit (₹)</th>
                                <th className="border p-2 text-right">Balance (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => {
                                const date = new Date(txn.date).toLocaleDateString();
                                const debit = txn.debit ? Number(txn.debit).toFixed(2) : '';
                                const credit = txn.credit ? Number(txn.credit).toFixed(2) : '';
                                const balance = Number(txn.balance).toFixed(2);

                                // Payment row logic: credit present and no relatedBillId
                                const isPayment = !!txn.credit && !txn.relatedBillId;

                                return (
                                    <tr key={txn.id || index}>
                                        <td className="border p-2">{date}</td>
                                        <td
                                            className={`border p-2 ${txn.relatedBillId
                                                ? 'text-blue-600 cursor-pointer hover:underline'
                                                : isPayment
                                                    ? 'text-green-600 cursor-pointer hover:underline'
                                                    : ''
                                                }`}
                                            onClick={() => {
                                                if (txn.relatedBillId) {
                                                    handleInvoiceClick(txn.relatedBillId);
                                                } else if (isPayment && txn.id) {
                                                    handlePaymentClick(txn.id);
                                                }
                                            }}
                                        >
                                            {txn.invoiceNumber
                                                ? `Invoice #${txn.invoiceNumber}`
                                                : isPayment
                                                    ? txn.description || txn.particulars || 'Payment'
                                                    : txn.particulars}
                                        </td>
                                        <td className="border p-2 text-right">{debit}</td>
                                        <td className="border p-2 text-right">{credit}</td>
                                        <td className="border p-2 text-right">{balance}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <button
                        onClick={downloadStatementPdf}
                        className="mt-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Download Statement PDF
                    </button>


                    {selectedBillId && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Edit Bill</h3>
                            <EditBillForm
                                billId={selectedBillId}
                                onClose={() => setSelectedBillId(null)}
                                onUpdated={() => {
                                    setSelectedBillId(null);
                                    fetchTransactions();
                                }}
                            />
                        </div>
                    )}

                    {selectedPaymentId && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Edit Payment</h3>
                            <PaymentEditForm
                                paymentId={selectedPaymentId}
                                onClose={() => setSelectedPaymentId(null)}
                                onUpdated={() => {
                                    setSelectedPaymentId(null);
                                    fetchTransactions();
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
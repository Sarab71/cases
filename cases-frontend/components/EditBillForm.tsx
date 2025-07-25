'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Item {
  modelNumber: string;
  quantity: number;
  rate: number;
  discount: number;
  totalAmount?: number;
}

interface Bill {
  id: string;
  invoiceNumber: number;
  items: Item[];
  customerId: string;
  date?: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
}

interface EditBillFormProps {
  billId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditBillForm({ billId, onClose, onUpdated }: EditBillFormProps) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editDate, setEditDate] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${billId}`);
      if (res.ok) {
        const data = await res.json();
        setBill(data);
        setItems(data.items);
        setEditDate(data.date ? data.date.split('T')[0] : '');

        // Fetch customer
        const custRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/${data.customerId}`);
        if (custRes.ok) {
          const custData = await custRes.json();
          setCustomer(custData);
        }
      }
    };

    fetchBill();
  }, [billId]);

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const updatedItems = [...items];
    if (field === 'modelNumber') {
      updatedItems[index][field] = String(value);
    } else {
      updatedItems[index][field] = Number(value);
    }
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateNetAmount = (item: Item) => item.quantity * item.rate;
  const calculateTotalAmount = (item: Item) => {
    const netAmount = calculateNetAmount(item);
    return netAmount - (netAmount * (item.discount / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItems = items.map((item) => {
      const totalAmount = calculateTotalAmount(item);
      return { ...item, totalAmount };
    });
    const grandTotal = updatedItems.reduce((sum, item) => sum + item.totalAmount!, 0);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${billId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: editDate,
        items: updatedItems,
        grandTotal
      }),
    });

    if (res.ok) {
      toast.success('Bill updated successfully!');
      onClose();
      onUpdated();
    } else {
      toast.error('Failed to update bill.');
    }
  };

  const handleDeleteBill = async () => {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${billId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Bill deleted successfully!');
      onClose();
      onUpdated();
    } else {
      toast.error('Failed to delete bill.');
    }
  };

  const downloadPdf = async () => {
    if (!bill || !customer) {
      toast.error('Customer details not loaded');
      return;
    }

    const processedItems = items.map((item) => {
      const totalAmount = calculateTotalAmount(item);
      return { ...item, totalAmount: Number(totalAmount.toFixed(2)) };
    });

    const grandTotal = processedItems.reduce((sum, item) => sum + item.totalAmount!, 0);

    const res = await fetch(`${process.env.NEXT_PUBLIC_PDF_API_URL}/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceNumber: bill.invoiceNumber,
        customer,
        items: processedItems,
        grandTotal,
        date: new Date(editDate).toLocaleDateString(),
      }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${bill.invoiceNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast.error('Failed to generate PDF');
    }
  };

  if (!bill) return <p>Loading bill details...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border mt-4 rounded space-y-4">
      <h3 className="text-lg font-semibold">Editing Invoice #{bill.invoiceNumber}</h3>

      <div>
        <label className="block font-medium mb-1">Bill Date</label>
        <input
          type="date"
          value={editDate}
          onChange={e => setEditDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Model Number</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Discount (%)</th>
              <th className="border p-2">Net Amount</th>
              <th className="border p-2">Total After Discount</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={item.modelNumber}
                    onChange={(e) => handleItemChange(index, 'modelNumber', e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.discount ?? 0}
                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2 text-right">
                  ₹ {calculateNetAmount(item).toFixed(2)}
                </td>
                <td className="border p-2 text-right">
                  ₹ {calculateTotalAmount(item).toFixed(2)}
                </td>
                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Update Bill</button>
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
        <button type="button" onClick={handleDeleteBill} className="bg-red-600 text-white px-3 py-1 rounded">Delete Bill</button>
        <button type="button" onClick={downloadPdf} className="bg-blue-600 text-white px-3 py-1 rounded">Export as PDF</button>
      </div>
    </form>
  );
}

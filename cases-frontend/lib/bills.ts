export async function createBill(customerId: string, bill: {
  invoiceNumber: number;
  date: string;
  items: any[];
  grandTotal: number;
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills?customerId=${customerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bill),
  });

  if (!response.ok) throw new Error('Failed to create bill');
  return response.json();
}


export async function getAllBills() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills`);
  if (!res.ok) throw new Error('Failed to fetch bills');
  return res.json();
}

export async function getBill(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${id}`);
  if (!res.ok) throw new Error('Bill not found');
  return res.json();
}

export async function updateBill(id: string, data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update bill');
  return res.json();
}

export async function deleteBill(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete bill');
  return res.json();
}


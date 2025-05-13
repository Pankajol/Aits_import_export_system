'use client';

import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/purchaseInvoice/${id}`);
        console.log(res.data.data)
        setInvoice(res.data.data);
      } catch (error) {
        console.error('Failed to fetch purchaseInvoice:', error);
        setError('Failed to fetch purchaseInvoice');
      }
    };

    if (id) {
        fetchInvoice();
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!invoice) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Link href="/admin/purchaseInvoice-view">
        <button className="mb-4 px-4 py-2 bg-gray-300 rounded">Back to Invoice List</button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Invoice Detail</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>invoice Number:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Supplier Name:</strong> {invoice.supplierName}</p>
        <p><strong>invoice Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Grand Total:</strong> {invoice.grandTotal}</p>
        <p><strong>Remarks:</strong> {invoice.remarks}</p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Items</h2>
        {invoice.items && invoice.items.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Unit Price</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.unitPrice}</td>
                  <td className="border p-2">{item.discount}</td>
                  <td className="border p-2">{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items available.</p>
        )}
      </div>
      <div className="mt-4">
        <Link href={`/admin/purchaseInvoice-view/new?editId=${invoice._id}`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit invoice</button>
        </Link>
      </div>
    </div>
  );
}

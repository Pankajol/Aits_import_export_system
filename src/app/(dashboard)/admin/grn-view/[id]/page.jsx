'use client';

import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GRNDetail() {
  const { id } = useParams();
  const [grn, setGrn] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGRN = async () => {
      try {
        const res = await axios.get(`/api/grn/${id}`);
        console.log(res.data.data)
        setGrn(res.data.data);
      } catch (error) {
        console.error('Failed to fetch GRN:', error);
        setError('Failed to fetch GRN');
      }
    };

    if (id) {
      fetchGRN();
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!grn) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Link href="/admin/grn-view">
        <button className="mb-4 px-4 py-2 bg-gray-300 rounded">Back to GRN List</button>
      </Link>
      <h1 className="text-3xl font-bold mb-6">GRN Detail</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>GRN Number:</strong> {grn.grnNumber}</p>
        <p><strong>Supplier Name:</strong> {grn.supplierName}</p>
        <p><strong>GRN Date:</strong> {new Date(grn.grnDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {grn.status}</p>
        <p><strong>Grand Total:</strong> {grn.grandTotal}</p>
        <p><strong>Remarks:</strong> {grn.remarks}</p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Items</h2>
        {grn.items && grn.items.length > 0 ? (
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
              {grn.items.map((item, index) => (
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
        <Link href={`/admin/grn-view/new?editId=${grn._id}`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit GRN</button>
        </Link>
      </div>
    </div>
  );
}

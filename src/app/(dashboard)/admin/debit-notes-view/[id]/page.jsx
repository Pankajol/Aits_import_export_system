"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function DebitNoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDebitNote() {
      try {
        const res = await axios.get(`/api/debit-note/${id}`);
        setNote(res.data);
      } catch (err) {
        setError("Failed to load Debit Note");
      } finally {
        setLoading(false);
      }
    }
    fetchDebitNote();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debit Note Details</h1>
      <p><strong>Supplier Name:</strong> {note.supplierName}</p>
      <p><strong>Reference Number:</strong> {note.refNumber}</p>
      <p><strong>Status:</strong> {note.status}</p>
      <p><strong>Grand Total:</strong> {parseFloat(note.grandTotal).toFixed(2)}</p>
      <p><strong>Created At:</strong> {new Date(note.createdAt).toLocaleString()}</p>
      <Link href={`/admin/debit-notes-view/${id}/edit`}>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded mt-4">Edit</button>
      </Link>
    </div>
  );
}

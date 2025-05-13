"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function CreditNoteView() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  const fetchCreditNotes = async () => {
    try {
      const res = await axios.get("/api/credit-note");
      // Assuming your API returns { success: true, creditNotes: [...] }
      if (res.data.success) {
        setNotes(Array.isArray(res.data.creditNotes) ? res.data.creditNotes : []);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching Credit Notes:", error);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Credit Note?")) return;
    try {
      const res = await axios.delete(`/api/credit-note/${creditMemoId}`);
      if (res.data.success) {
        alert("Deleted successfully");
        fetchCreditNotes();
      }
    } catch (error) {
      console.error("Error deleting Credit Note:", error);
      alert("Failed to delete Credit Note");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Credit Note List</h1>
      <div className="flex justify-end mb-4">
        <Link href="/admin/credit-memo">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition duration-200">
            <FaEdit className="mr-2" />
            Create New Credit Note
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Customer Code</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Contact Person</th>
              <th className="py-3 px-4 border-b">Reference Number</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b text-center">{note.customerCode}</td>
                <td className="py-3 px-4 border-b text-center">{note.customerName}</td>
                <td className="py-3 px-4 border-b text-center">{note.contactPerson}</td>
                <td className="py-3 px-4 border-b text-center">{note.refNumber}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex justify-center space-x-2">
                    <Link href={`/admin/credit-note/${note._id}`}>
                      <button
                        className="flex items-center px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition duration-200"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </Link>
                    <Link href={`/admin/credit-memo-veiw/${note._id}/edit`}>
                      <button
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No Credit Notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



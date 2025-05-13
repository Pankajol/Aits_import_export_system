// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function PurchaseQuotationView() {
//   const { id } = useParams();
//   const [quotation, setQuotation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!id) return;
//     axios
//       .get(`/api/purchase-quotation/${id}`)
//       .then((res) => {
//         if (res.data.success) {
//           setQuotation(res.data.data);
//         } else {
//           setError(res.data.error || "Quotation not found.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching quotation:", err);
//         setError(err.message);
//       });
//   }, [id]);

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-red-600">
//         Error: {error}
//       </div>
//     );
//   }

//   if (!quotation) {
//     return (
//       <div className="container mx-auto p-6">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Purchase Quotation Details</h1>
//       <p><strong>Reference Number:</strong> {quotation.refNumber}</p>
//       <p><strong>Supplier Name:</strong> {quotation.supplierName}</p>
//       <p><strong>Status:</strong> {quotation.status}</p>
//       <p>
//         <strong>Posting Date:</strong>{" "}
//         {quotation.postingDate ? new Date(quotation.postingDate).toLocaleDateString() : ""}
//       </p>
//       <p>
//         <strong>Valid Until:</strong>{" "}
//         {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : ""}
//       </p>
//       <p>
//         <strong>Delivery Date:</strong>{" "}
//         {quotation.documentDate ? new Date(quotation.documentDate).toLocaleDateString() : ""}
//       </p>
//       {quotation.items && quotation.items.length > 0 ? (
//         <div className="mt-4">
//           <h2 className="text-2xl font-semibold">Items</h2>
//           <ul className="list-disc ml-6">
//             {quotation.items.map((item, index) => (
//               <li key={index}>
//                 <strong>Item Name:</strong> {item.itemDescription || "N/A"} – 
//                 <strong> Qty:</strong> {item.quantity} – 
//                 <strong> Price:</strong> {item.unitPrice}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p className="mt-4">No items found.</p>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function PurchaseQuotationView() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/purchase-quotation/${id}`)
      .then((res) => {
        if (res.data.success) {
          setQuotation(res.data.data);
          setError(null);
        } else {
          setError(res.data.error || "Quotation not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching quotation:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No quotation data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center">Purchase Quotation Details</h1>
      
      {/* Basic Info Section */}
      <div className="bg-white shadow-md rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg">
              <span className="font-bold">Reference Number:</span> {quotation.refNumber}
            </p>
            <p className="text-lg">
              <span className="font-bold">Supplier Name:</span> {quotation.supplierName}
            </p>
            <p className="text-lg">
              <span className="font-bold">Status:</span> {quotation.status}
            </p>
          </div>
          <div>
            <p className="text-lg">
              <span className="font-bold">Posting Date:</span>{" "}
              {quotation.postingDate ? new Date(quotation.postingDate).toLocaleDateString() : "-"}
            </p>
            <p className="text-lg">
              <span className="font-bold">Valid Until:</span>{" "}
              {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : "-"}
            </p>
            <p className="text-lg">
              <span className="font-bold">Delivery Date:</span>{" "}
              {quotation.documentDate ? new Date(quotation.documentDate).toLocaleDateString() : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Items</h2>
        {quotation.items && quotation.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotation.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.itemDescription || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.unitPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No items found.</p>
        )}
      </div>
    </div>
  );
}

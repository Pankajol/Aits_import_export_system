// pages/admin/production-orders/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductionOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [transferQty, setTransferQty] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/production-orders")
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openQtyModal = (order) => {
    setCurrentOrder(order);
    setTransferQty(order.quantity);
    setModalOpen(true);
  };

  const confirmQtyTransfer = () => {
    if (transferQty < 1 || transferQty > currentOrder.quantity) {
      alert(`Enter quantity between 1 and ${currentOrder.quantity}`);
      return;
    }
    router.push(`/admin/stock-transfer/${currentOrder._id}?qty=${transferQty}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await axios.delete(`/api/production-orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const onActionChange = (id, action) => {
    setSelectedAction(prev => ({ ...prev, [id]: "" }));
    if (action === "stockTransfer") {
      const order = orders.find(o => o._id === id);
      openQtyModal(order);
    } else if (action === "issueProduction") {
      router.push(`/admin/issue-production/${id}`);
    } else if (action === "receiptProduction") {
      router.push(`/admin/receipt-production/${id}`);
    }
  };

  if (loading) return <p>Loading production orders…</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-6">Production Orders</h1>
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => {
            const sel = selectedAction[o._id] || "";
            return (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{idx + 1}</td>
                <td className="border p-2">{o.productDesc || o.bomId}</td>
                <td className="border p-2 text-right">{o.quantity}</td>
                <td className="border p-2">{new Date(o.productionDate).toLocaleDateString()}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2 flex items-center gap-2">
                  {o.status === "planned" && (
                    <a href={`/admin/ProductionOrder/${o._id}`} className="flex items-center gap-1 text-green-600">
                      <Pencil size={16} /> Update
                    </a>
                  )}

                  {o.status !== "planned" && (
                    <select
                      className="border p-1 rounded bg-gray-50"
                      value={sel}
                      onChange={e => onActionChange(o._id, e.target.value)}
                    >
                      <option value="">— Actions —</option>
                      <option value="stockTransfer">Stock Transfer</option>
                      <option value="issueProduction">Issue for Production</option>
                      <option value="receiptProduction">Receipt from Production</option>
                    </select>
                  )}

                  <a
                    href={`/admin/productionorderdetail-view/${o._id}`}
                    className="flex items-center gap-1 text-blue-600"
                  >
                    <Eye size={16} /> View
                  </a>

                  <button
                    onClick={() => handleDelete(o._id)}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-lg font-semibold mb-4">Enter Transfer Quantity</h2>
            <p className="mb-2">Max: {currentOrder.quantity}</p>
            <input
              type="number"
              min={1}
              max={currentOrder.quantity}
              value={transferQty}
              onChange={e => setTransferQty(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button onClick={confirmQtyTransfer} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// 11/05/2025 still
// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Pencil, Trash2, Eye } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function ProductionOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // per-order action selection
//   const [selectedAction, setSelectedAction] = useState({});
//   const router = useRouter();

//   useEffect(() => {
//     axios
//       .get("/api/production-orders")
//       .then(res => setOrders(res.data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this order?")) return;
//     try {
//       await axios.delete(`/api/production-orders/${id}`);
//       setOrders(prev => prev.filter(o => o._id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };
//   const onActionChange = async (id, action) => {
//     // Clear the dropdown for that row
//     setSelectedAction(prev => ({ ...prev, [id]: "" }));
  
//     try {
//       switch (action) {
//         case "stockTransfer":
//           await router.push(`/admin/stock-transfer/${id}`);
//           break;
//         case "issueProduction":
//           await router.push(`/admin/issue-production/${id}`);
//           break;
//         case "receiptProduction":
//           await router.push(`/admin/receipt-production/${id}`);
//           break;
//         default:
//           return;
//       }
//     } catch (error) {
//       console.error("Navigation error:", error);
//       alert("Failed to navigate. Please try again.");
//     }
//   };
  
//   if (loading) return <p>Loading production orders…</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-semibold mb-6">Production Orders</h1>
//       <table className="w-full table-auto border-collapse text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">#</th>
//             <th className="border p-2">Product</th>
//             <th className="border p-2">Quantity</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((o, idx) => {
//             const sel = selectedAction[o._id] || "";
//             return (
//               <tr key={o._id} className="hover:bg-gray-50">
//                 <td className="border p-2 text-center">{idx + 1}</td>
//                 <td className="border p-2">{o.productDesc || o.bomId}</td>
//                 <td className="border p-2 text-right">{o.quantity}</td>
//                 <td className="border p-2">
//                   {new Date(o.productionDate).toLocaleDateString()}
//                 </td>
//                 <td className="border p-2">{o.status}</td>
//                 <td className="border p-2 flex items-center gap-2">
//                   {o.status === "planned" && (
//                     <a
//                       href={`/admin/ProductionOrder/${o._id}`}
//                       className="flex items-center gap-1 text-green-600"
//                     >
//                       <Pencil size={16} /> Update
//                     </a>
//                   )}

//                   {o.status !== "planned" && (
//                     <select
//                       className="border p-1 rounded bg-gray-50"
//                       value={sel}
//                       onChange={e => {
//                         setSelectedAction(prev => ({
//                           ...prev,
//                           [o._id]: e.target.value
//                         }));
//                         onActionChange(o._id, e.target.value);
//                       }}
//                     >
//                       <option value="">— Actions —</option>
//                       <option value="stockTransfer">
//                         Stock Transfer
//                       </option>
//                       <option value="issueProduction">
//                         Issue for Production
//                       </option>
//                       <option value="receiptProduction">
//                         Receipt from Production
//                       </option>
//                     </select>
//                   )}

//                   <a
//                     href={`/admin/productionorderdetail-view/${o._id}`}
//                     className="flex items-center gap-1 text-blue-600"
//                   >
//                     <Eye size={16} /> View
//                   </a>

//                   <button
//                     onClick={() => handleDelete(o._id)}
//                     className="flex items-center gap-1 text-red-600"
//                   >
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

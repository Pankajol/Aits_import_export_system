// pages/admin/stock-transfer/[orderId]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import MultiBatchModal from "@/components/MultiBatchModal";

export default function StockTransferPage() {
  const { orderId } = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const qtyParam = Number(search.get("qty"));

  const [order, setOrder] = useState(null);
  const [rows, setRows] = useState([]);
  const [docNo, setDocNo] = useState("");
  const [docDate, setDocDate] = useState("");
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [sourceWarehouseOptions, setSourceWarehouseOptions] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [batchModal, setBatchModal] = useState({ open: false, idx: null });
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load warehouses
  useEffect(() => {
    axios.get("/api/warehouse").then(res => {
      setWarehouseOptions(res.data);
      setSourceWarehouseOptions(res.data);
    }).catch(console.error);
  }, []);

  // Fetch batches from inventory API (using ObjectId) when modal opens
  useEffect(() => {
    if (!batchModal.open) return;
    const { itemId, sourceWarehouse: wh } = rows[batchModal.idx];
    axios.get(`/api/inventory/${itemId}/${wh}`)
      .then(res => setBatchOptions(res.data.batches || []))
      .catch(err => console.error("Error fetching inventory batches:", err));
  }, [batchModal, rows]);

  // Load production order and prepare rows
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: ord } = await axios.get(`/api/production-orders/${orderId}`);
        setOrder(ord);
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        setDocNo(`ST-${today}-${orderId.slice(-4)}`);
        setDocDate(new Date().toISOString().substr(0, 10));
        const sw = ord.warehouse?._id || ord.warehouse || "";
        setSourceWarehouse(sw);
        const itemRows = ord.items.map(item => ({
          itemId: item._id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          uom: item.unitQty > 1 ? `x${item.unitQty}` : "pcs",
          qty: qtyParam * item.quantity,
          batchNo: "",
          batches: [],
          sourceWarehouse: item.warehouse?._id || item.warehouse || "",
          destination: ord.warehouse?._id || ord.warehouse || ""
        }));
        setRows(itemRows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, qtyParam]);

  const onChange = (idx, field, value) => {
    setRows(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const openBatchModal = idx => setBatchModal({ open: true, idx });
  const closeBatchModal = () => setBatchModal({ open: false, idx: null });

  const handleUpdateBatch = selectedBatches => {
    const total = selectedBatches.reduce((sum, sel) => sum + Number(sel.quantity || 0), 0);
    const item = rows[batchModal.idx];
    if (total !== item.qty) {
      alert(`Total allocated must equal ${item.qty}`);
      return;
    }
    setRows(prev => {
      const copy = [...prev];
      copy[batchModal.idx] = {
        ...copy[batchModal.idx],
        batches: selectedBatches,
        batchNo: selectedBatches.map(s => s.batch.batchNumber).join(", ")
      };
      return copy;
    });
    closeBatchModal();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      orderId,
      documentNo: docNo,
      documentDate: docDate,
      sourceWarehouse,
      items: rows.map(r => ({
        itemCode: r.itemCode,
        qty: r.qty,
        uom: r.uom,
        batchNo: r.batchNo,
        batchAllocations: r.batches,
        sourceWarehouse: r.sourceWarehouse,
        destinationWarehouse: r.destination
      }))
    };
    try {
      await axios.post("/api/stock-transfers", payload);
      alert("Stock transfer successful!");
      router.push("/admin/production-orders");
    } catch (err) {
      console.error(err);
      alert("Transfer failed.");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-6">Stock Transfer</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header grid */}
        <div className="grid grid-cols-3 gap-4">
          <label className="block">Document No
            <input type="text" readOnly value={docNo} className="w-full border p-2 bg-gray-100 rounded" />
          </label>
          <label className="block">Document Date
            <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)} className="w-full border p-2 rounded" />
          </label>
          <label className="block">Source Warehouse
            <select value={sourceWarehouse} onChange={e => setSourceWarehouse(e.target.value)} className="w-full border p-2 rounded" required>
              <option value="">-- select --</option>
              {sourceWarehouseOptions.map(w => <option key={w._id} value={w._id}>{w.warehouseName}</option>)}
            </select>
          </label>
        </div>

        {/* Items table */}
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item Code</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Batch No</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Destination</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-1">{r.itemCode}</td>
                <td className="border p-1">{r.itemName}</td>
                <td className="border p-1">
                  <input type="number" value={r.qty} onChange={e => onChange(i, 'qty', Number(e.target.value))} className="w-full border p-1 rounded" />
                </td>
                <td className="border p-1">
                  <button type="button" onClick={() => openBatchModal(i)} className="w-full text-left border p-1 rounded">
                    {r.batchNo || 'Select batches'}
                  </button>
                </td>
                <td className="border p-1">
                  <select value={r.sourceWarehouse} onChange={e => onChange(i, 'sourceWarehouse', e.target.value)} className="w-full border p-1 rounded">
                    {warehouseOptions.map(w => <option key={w._id} value={w._id}>{w.warehouseName}</option>)}
                  </select>
                </td>
                <td className="border p-1">
                  <select value={r.destination} onChange={e => onChange(i, 'destination', e.target.value)} className="w-full border p-1 rounded">
                    {warehouseOptions.map(w => <option key={w._id} value={w._id}>{w.warehouseName}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit Transfer</button>
      </form>

      {/* Batch Modal */}
      {batchModal.open && (
        <MultiBatchModal
          itemsbatch={{
            item: rows[batchModal.idx].itemCode,
            warehouse: rows[batchModal.idx].sourceWarehouse,
            itemName: rows[batchModal.idx].itemName,
            quantity: rows[batchModal.idx].qty,
            batches: rows[batchModal.idx].batches
          }}
          onClose={closeBatchModal}
          onUpdateBatch={handleUpdateBatch}
        />
      )}
    </div>
  );
}



// // pages/admin/stock-transfer/[orderId]/page.jsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";

// export default function StockTransferPage() {
//   const { orderId } = useParams();
//   const search = useSearchParams();
//   const router = useRouter();
//   const qtyParam = Number(search.get("qty"));

//   const [order, setOrder] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [docNo, setDocNo] = useState("");
//   const [docDate, setDocDate] = useState("");
//   const [sourceWarehouseOptions, setSourceWarehouseOptions] = useState([]);
//   const [sourceWarehouse, setSourceWarehouse] = useState("");
//   const [warehouseOptions, setWarehouseOptions] = useState([]);
//   const [batchModal, setBatchModal] = useState({ open: false, idx: null });
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Load warehouses
//   useEffect(() => {
//     axios.get("/api/warehouse")
//       .then(res => {
//         setWarehouseOptions(res.data);
//         setSourceWarehouseOptions(res.data);
//       })
//       .catch(console.error);
//   }, []);

//   // Load order, document info, and rows
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`/api/production-orders/${orderId}`);
//         const ord = res.data;
//         setOrder(ord);
//         // Doc no & date
//         const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//         setDocNo(`ST-${today}-${orderId.slice(-4)}`);
//         setDocDate(new Date().toISOString().substr(0, 10));
//         // Source warehouse default
//         const sw = ord.warehouse?._id || ord.warehouse || "";
//         setSourceWarehouse(sw);
//                 // Prepare rows
//         const itemRows = ord.items.map(item => ({
//           itemCode: item.itemCode,
//           itemName: item.itemName,
//           uom: item.unitQty > 1 ? `x${item.unitQty}` : "pcs",
//           qty: qtyParam * item.quantity,
//           batchNo: "",
//           // each item’s original warehouse as source
//           sourceWarehouse: item.warehouse?._id || item.warehouse || "",
//           // default destination is production order’s warehouse
//           destination: ord.warehouse?._id || ord.warehouse || ""
//         }));
//         setRows(itemRows);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId, qtyParam]);

//   const onChange = (idx, field, value) => {
//     setRows(prev => {
//       const copy = [...prev];
//       copy[idx] = { ...copy[idx], [field]: value };
//       return copy;
//     });
//   };

//   const openBatch = idx => setBatchModal({ open: true, idx });
//   const confirmBatch = () => {
//     setRows(prev => prev.map((r, i) => i === batchModal.idx ? { ...r, batchNo: selectedBatch } : r));
//     setBatchModal({ open: false, idx: null });
//     setSelectedBatch("");
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const payload = {
//       orderId,
//       documentNo: docNo,
//       documentDate: docDate,
//       sourceWarehouse,
//       items: rows.map(r => ({
//         itemCode: r.itemCode,
//         qty: r.qty,
//         uom: r.uom,
//         batchNo: r.batchNo,
//         sourceWarehouse: r.sourceWarehouse,
//         destinationWarehouse: r.destination
//       }))
//     };
//     try {
//       await axios.post("/api/stock-transfers", payload);
//       alert("Stock transfer successful!");
//       router.push("/admin/production-orders");
//     } catch (err) {
//       console.error(err);
//       alert("Transfer failed.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!order) return <p>Order not found.</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
//       <h1 className="text-xl font-bold mb-4">Stock Transfer</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Header fields */}
//         <div className="grid grid-cols-3 gap-4">
//           <label className="block">
//             Document No
//             <input type="text" readOnly value={docNo} className="w-full border p-2 bg-gray-100 rounded" />
//           </label>
//           <label className="block">
//             Document Date
//             <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)} className="w-full border p-2 rounded" />
//           </label>
//           <label className="block">
//             Source Warehouse
//             <select value={sourceWarehouse} onChange={e => setSourceWarehouse(e.target.value)} className="w-full border p-2 rounded" required>
//               <option value="">-- select source --</option>
//               {sourceWarehouseOptions.map(w => (
//                 <option key={w._id} value={w._id}>{w.warehouseName}</option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Items table */}
//         <table className="w-full text-sm border border-gray-300 mt-4">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Item Code</th>
//               <th className="border p-2">Item Name</th>
//               {/* <th className="border p-2">UOM</th> */}
//               <th className="border p-2">Qty</th>
//               <th className="border p-2">Batch No</th>
//               <th className="border p-2">Source Warehouse</th>
//               <th className="border p-2">Destination Warehouse</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 <td className="border p-1">{row.itemCode}</td>
//                 <td className="border p-1">{row.itemName}</td>
//                 {/* <td className="border p-1">{row.uom}</td> */}
//                 <td className="border p-1">
//                   <input type="number" value={row.qty} onChange={e => onChange(i, 'qty', Number(e.target.value))} className="w-full border p-1 rounded" />
//                 </td>
//                 <td className="border p-1">
//                   <button type="button" onClick={() => openBatch(i)} className="w-full text-left border p-1 rounded">
//                     {row.batchNo || 'Select batch'}
//                   </button>
//                 </td>
//                 <td className="border p-1">
//                   <select value={row.sourceWarehouse} onChange={e => onChange(i, 'sourceWarehouse', e.target.value)} className="w-full border p-1 rounded" required>
//                     <option value="">-- select source --</option>
//                     {warehouseOptions.map(w => (
//                       <option key={w._id} value={w._id}>{w.warehouseName}</option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className="border p-1">
//                   <select value={row.destination} onChange={e => onChange(i, 'destination', e.target.value)} className="w-full border p-1 rounded" required>
//                     <option value="">-- select dest --</option>
//                     {warehouseOptions.map(w => (
//                       <option key={w._id} value={w._id}>{w.warehouseName}</option>
//                     ))}
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//           Submit Transfer
//         </button>
//       </form>

//       {/* Batch modal */}
//       {batchModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow w-80">
//             <h2 className="text-lg font-semibold mb-2">Select Batch for {rows[batchModal.idx].itemName}</h2>
//             <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full border p-2 mb-4 rounded">
//               <option value="">-- choose batch --</option>
//               {/* Optionally fetch inventory batches here */}
//               <option value="BATCH-A">BATCH-A</option>
//               <option value="BATCH-B">BATCH-B</option>
//             </select>
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setBatchModal({ open: false, idx: null })} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
//               <button onClick={confirmBatch} className="px-3 py-1 bg-blue-600 text-white rounded">OK</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





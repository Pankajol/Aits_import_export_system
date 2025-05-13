"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function IssueProductionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [docNo, setDocNo] = useState("");
  const [docDate, setDocDate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [rows, setRows] = useState([]);



  useEffect(() => {
    // axios.get("/api/bom").then(res => setBoms(res.data));
    // axios.get("/api/items").then(res => setAllItems(res.data));
    axios.get("/api/warehouse").then(res =>
      setWarehouseOptions(
        res.data.map(w => ({ value: w._id, label: w.warehouseName }))
      )

    );
  }, []);

  useEffect(() => {
    if (!orderId) return;
    axios
      .get(`/api/production-orders/${orderId}`)
      .then((res) => {
        const o = res.data;
        setDocNo(o.documentNo || "");
        setDocDate(o.documentDate?.substr(0, 10) || "");
        setWarehouse(o.warehouse?.warehouseName || "");
        setRows(
          o.items.map((it) => ({
            itemCode: it.itemCode._id ?? it.itemCode,
            itemName: it.itemCode.itemName,
            qty: it.qty,
            price: it.price ?? 0,
          }))
        );
      })
      .catch(console.error);
  }, [orderId]);

  const onChange = (idx, field, val) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx][field] = val;
      return next;
    });
  };

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { itemCode: "", itemName: "", qty: "", price: "" },
    ]);

  const rowTotal = (r) => (Number(r.qty) * Number(r.price)) || 0;
  const grandTotal = () => rows.reduce((sum, r) => sum + rowTotal(r), 0);

  const save = () => {
    axios
      .post(`/api/issue-production/${orderId}`, {
        id: orderId,
        documentNo: docNo,
        documentDate: docDate,
        warehouse,
        items: rows.map((r) => ({
          itemCode: r.itemCode,
          qty: r.qty,
          price: r.price,
        })),
      })
      .then(() => router.push("/issue-production"))
      .catch(console.error);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Issue for Production</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <label>
          Document No<br />
          <input
            className="border p-2 w-full"
            value={docNo}
            onChange={(e) => setDocNo(e.target.value)}
          />
        </label>
        <label>
          Document Date<br />
          <input
            type="date"
            className="border p-2 w-full"
            value={docDate}
            onChange={(e) => setDocDate(e.target.value)}
          />
        </label>
        <label>
          Warehouse<br />
          <select
            className="w-full border p-2 rounded"
            value={warehouse}
            onChange={e => setWarehouse(e.target.value)}
          >
            <option value="">-- select warehouse --</option>
            {warehouseOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select> 
        </label>
      </div>

      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Code</th>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-1">{r.itemCode}</td>
              <td className="border p-1">{r.itemName}</td>
              <td className="border p-1">
                <input
                  type="number"
                  className="w-full"
                  value={r.qty}
                  onChange={(e) => onChange(i, "qty", e.target.value)}
                />
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  className="w-full"
                  value={r.price}
                  onChange={(e) => onChange(i, "price", e.target.value)}
                />
              </td>
              <td className="border p-1 text-right">{rowTotal(r)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border-t p-2 text-right font-semibold">
              Grand Total
            </td>
            <td className="border-t p-2 text-right font-semibold">
              {grandTotal()}
            </td>
          </tr>
        </tfoot>
      </table>


      <div className="mt-4">
        <button onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded">
          + Add Row
        </button>
        <button onClick={save} className="ml-2 px-4 py-2 bg-green-600 text-white rounded">
          Save
        </button>
      </div>
    </div>
  );
}

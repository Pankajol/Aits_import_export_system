"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryView = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchItemCode, setSearchItemCode] = useState("");
  const [searchItemName, setSearchItemName] = useState("");
  const [searchWarehouseName, setSearchWarehouseName] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    axios
      .get("/api/inventory")
      .then((res) => {
        setInventoryData(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setError(err.message || "Error fetching inventory");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading inventory...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const filteredInventory = inventoryData.filter((inv) => {
    const itemCode = inv.item?.itemCode || "";
    const itemName = inv.item?.itemName || "";
    const warehouseName = inv.warehouse?.warehouseName || "";
    return (
      (!searchItemCode || itemCode.toLowerCase().includes(searchItemCode.toLowerCase())) &&
      (!searchItemName || itemName.toLowerCase().includes(searchItemName.toLowerCase())) &&
      (!searchWarehouseName || warehouseName.toLowerCase().includes(searchWarehouseName.toLowerCase()))
    );
  });

  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <input type="text" placeholder="Search by Item Code" value={searchItemCode} onChange={(e) => setSearchItemCode(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Search by Item Name" value={searchItemName} onChange={(e) => setSearchItemName(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Search by Warehouse Name" value={searchWarehouseName} onChange={(e) => setSearchWarehouseName(e.target.value)} className="p-2 border rounded" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Warehouse Code</th>
              <th className="border p-2">Warehouse Name</th>
              <th className="border p-2">Item Code</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Commit</th>
              <th className="border p-2">Order</th>
              <th className="border p-2">Available</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((inv, index) => {
              const stock = inv.quantity || 0;
              const commit = inv.committed || 0;
              const order = inv.onOrder || 0;
              const available = stock + order - commit;
              const isExpanded = expandedRows.includes(index);

              return (
                <React.Fragment key={index}>
                  <tr className={`border-t cursor-pointer ${isExpanded ? "bg-gray-100" : ""}`} onClick={() => toggleRowExpansion(index)}>
                    <td className="border p-2">{inv.warehouse?.warehouseCode || "N/A"}</td>
                    <td className="border p-2">{inv.warehouse?.warehouseName || "N/A"}</td>
                    <td className="border p-2">{inv.item?.itemCode || "N/A"}</td>
                    <td className="border p-2">{inv.item?.itemName || "N/A"}</td>
                    <td className="border p-2">{stock}</td>
                    <td className="border p-2">{commit}</td>
                    <td className="border p-2">{order}</td>
                    <td className="border p-2">{available}</td>
                  </tr>
                  {isExpanded && inv.batches && (
                    <tr>
                      <td colSpan="8" className="p-2">
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2">Batch Number</th>
                                <th className="border p-2">Expiration Date</th>
                                <th className="border p-2">Quantity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.batches.map((batch, batchIndex) => (
                                <tr key={batchIndex}>
                                  <td className="border p-2">{batch.batchNumber || "N/A"}</td>
                                  <td className="border p-2">{batch.expiryDate || "N/A"}</td>
                                  <td className="border p-2">{batch.quantity || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;

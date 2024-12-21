// app/item-form/page.js
"use client";
import { useState } from "react";

export default function ItemForm() {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    itemGroup: "",
    status: "active",
    unitOfMeasurement: "",
    barcode: "",
    valuationMethod: "FIFO",
    maintainStock: false,
    sellingPrice: 0,
    purchasePrice: 0,
    minimumOrderQty: 0,
    shelfLife: 0,
    warrantyPeriod: 0,
    leadTime: 0,
    qualityInspection: "",
    materialRequestType: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`Item added successfully: ${data.item.itemName}`);
        setFormData({
          itemCode: "",
          itemName: "",
          itemGroup: "",
          status: "active",
          unitOfMeasurement: "",
          barcode: "",
          valuationMethod: "FIFO",
          maintainStock: false,
          sellingPrice: 0,
          purchasePrice: 0,
          minimumOrderQty: 0,
          shelfLife: 0,
          warrantyPeriod: 0,
          leadTime: 0,
          qualityInspection: "",
          materialRequestType: "",
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Item Details Form</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Item Details Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Item Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter item code"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Item Group</label>
              <input
                type="text"
                name="itemGroup"
                value={formData.itemGroup}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter item group"
              />
            </div>
          </div>
        </div>

        {/* General Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Unit of Measurement
              </label>
              <input
                type="text"
                name="unitOfMeasurement"
                value={formData.unitOfMeasurement}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., kg, pcs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Barcode</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter barcode"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Valuation Method
              </label>
              <select
                name="valuationMethod"
                value={formData.valuationMethod}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="FIFO">FIFO</option>
                <option value="LIFO">LIFO</option>
                <option value="STANDARD">Standard</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="maintainStock"
                checked={formData.maintainStock}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">Maintain Stock</label>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Order Qty
              </label>
              <input
                type="number"
                name="minimumOrderQty"
                value={formData.minimumOrderQty}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Shelf Life (In days)
              </label>
              <input
                type="number"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter shelf life"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Warranty Period (In days)
              </label>
              <input
                type="number"
                name="warrantyPeriod"
                value={formData.warrantyPeriod}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter warranty period"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lead Time</label>
              <input
                type="number"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter lead time"
              />
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

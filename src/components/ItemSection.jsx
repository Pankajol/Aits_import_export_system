"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// Helper function to round a number to two decimal places.
const round = (num, decimals = 2) => {
  const n = Number(num);
  if (isNaN(n)) return 0;
  return Number(n.toFixed(decimals));
};

// Computes derived fields based on an item object.
// For GST, the function computes CGST and SGST amounts (defaulting each to half of the gstRate)
// and then sums them to return the GST Amount.
const computeItemValues = (item) => {
  const quantity = parseFloat(item.quantity) || 0;
  const unitPrice = parseFloat(item.unitPrice) || 0;
  const discount = parseFloat(item.discount) || 0;
  const freight = parseFloat(item.freight) || 0;
  const priceAfterDiscount = round(unitPrice - discount);
  const totalAmount = round(quantity * priceAfterDiscount + freight);

  if (item.taxOption === "GST") {
    const gstRate = item.gstRate !== undefined ? parseFloat(item.gstRate) : 0;
    const cgstRate = item.cgstRate !== undefined ? parseFloat(item.cgstRate) : (gstRate / 2);
    const sgstRate = item.sgstRate !== undefined ? parseFloat(item.sgstRate) : (gstRate / 2);
    const cgstAmount = round(totalAmount * (cgstRate / 100));
    const sgstAmount = round(totalAmount * (sgstRate / 100));
    // GST Amount is the sum of CGST and SGST amounts.
    const gstAmount = cgstAmount + sgstAmount;
    return { priceAfterDiscount, totalAmount, gstAmount, cgstAmount, sgstAmount, igstAmount: 0 };
  } else if (item.taxOption === "IGST") {
    let igstRate = item.igstRate;
    if (igstRate === undefined || parseFloat(igstRate) === 0) {
      igstRate = item.gstRate !== undefined ? parseFloat(item.gstRate) : 0;
    } else {
      igstRate = parseFloat(igstRate);
    }
    const igstAmount = round(totalAmount * (igstRate / 100));
    return { priceAfterDiscount, totalAmount, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount };
  }
  return { priceAfterDiscount, totalAmount, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0 };
};

const ItemSection = ({ items, onItemChange, onAddItem }) => {
  const [apiItems, setApiItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  // Fetch items from API on mount.
  useEffect(() => {
    axios
      .get("/api/items")
      .then((res) => setApiItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch warehouses from API on mount.
  useEffect(() => {
    axios
      .get("/api/warehouse")
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error("Error fetching warehouses:", err));
  }, []);

  // For header display, assume all rows use the same tax option as the first item.
  const globalTaxOption = items && items.length > 0 ? items[0].taxOption || "GST" : "GST";

  const handleSearchChange = (index, value) => {
    onItemChange(index, { target: { name: "itemName", value } });
    if (value.length > 0) {
      setFilteredItems(
        apiItems.filter((itm) =>
          itm.itemName.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearchChangeWarehouse = (index, value) => {
    onItemChange(index, { target: { name: "warehouseName", value } });
    if (value.length > 0) {
      setFilteredWarehouses(
        warehouses.filter((wh) =>
          wh.warehouseName.toLowerCase().includes(value.toLowerCase()) ||
          wh.warehouseCode.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowWarehouseDropdown(true);
    } else {
      setShowWarehouseDropdown(false);
    }
  };

  const handleWarehouseSelect = (index, selectedWarehouse) => {
    onItemChange(index, { target: { name: "warehouse", value: selectedWarehouse._id } });
    onItemChange(index, { target: { name: "warehouseName", value: selectedWarehouse.warehouseName } });
    onItemChange(index, { target: { name: "warehouseCode", value: selectedWarehouse.warehouseCode } });
    setShowWarehouseDropdown(false);
  };

  // Generic update for numeric fields.
  const handleFieldChange = (index, field, value) => {
    const newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    const currentItem = items[index] || {};
    const updatedItem = { ...currentItem, [field]: newValue };
    const computed = computeItemValues(updatedItem);
    onItemChange(index, { target: { name: field, value: newValue } });
    onItemChange(index, { target: { name: "priceAfterDiscount", value: computed.priceAfterDiscount } });
    onItemChange(index, { target: { name: "totalAmount", value: computed.totalAmount } });
    onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
    onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
    onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
    onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
  };

  // Update GST rate.
  const handleGstRateChange = (index, value) => {
    const newGstRate = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    const currentItem = items[index] || {};
    const updatedItem = { ...currentItem, gstRate: newGstRate };
    const computed = computeItemValues(updatedItem);
    onItemChange(index, { target: { name: "gstRate", value: newGstRate } });
    // Update GST, CGST and SGST amounts.
    onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
    onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
    onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
  };

  // Update IGST rate.
  const handleIgstRateChange = (index, value) => {
    const newIgstRate = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    const currentItem = items[index] || {};
    const updatedItem = { ...currentItem, igstRate: newIgstRate };
    const computed = computeItemValues(updatedItem);
    onItemChange(index, { target: { name: "igstRate", value: newIgstRate } });
    onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
  };

  // Change tax option.
  // When switching to IGST, auto–set igstRate if missing.
  const handleTaxOptionChange = (index, value) => {
    onItemChange(index, { target: { name: "taxOption", value } });
    const currentItem = items[index] || {};
    let updatedItem = { ...currentItem, taxOption: value };
    if (value === "IGST" && (!currentItem.igstRate || parseFloat(currentItem.igstRate) === 0)) {
      updatedItem.igstRate = currentItem.gstRate || 0;
      onItemChange(index, { target: { name: "igstRate", value: updatedItem.igstRate } });
    }
    const computed = computeItemValues(updatedItem);
    onItemChange(index, { target: { name: "priceAfterDiscount", value: computed.priceAfterDiscount } });
    onItemChange(index, { target: { name: "totalAmount", value: computed.totalAmount } });
    onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
    onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
    onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
    onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
  };

  // When an item is selected from the search dropdown.
  // Auto–set igstRate to gstRate if taxOption is IGST and no igstRate exists.
  const handleItemSelect = (index, selectedItem) => {
    const itemId = selectedItem._id;
    if (!itemId) {
      console.error("Selected item does not have a valid _id.");
      return;
    }
    const unitPrice = parseFloat(selectedItem.unitPrice) || 0;
    const discount = parseFloat(selectedItem.discount) || 0;
    const freight = parseFloat(selectedItem.freight) || 0;
    const quantity = 1; // default quantity

    const taxOption = selectedItem.taxOption || "GST";
    const gstRate = selectedItem.gstRate !== undefined ? parseFloat(selectedItem.gstRate) : 0;
    let igstRate = 0;
    if (taxOption === "IGST") {
      igstRate =
        selectedItem.igstRate !== undefined && parseFloat(selectedItem.igstRate) !== 0
          ? parseFloat(selectedItem.igstRate)
          : gstRate;
    }
    const cgstRate = selectedItem.cgstRate !== undefined ? parseFloat(selectedItem.cgstRate) : (gstRate / 2);
    const sgstRate = selectedItem.sgstRate !== undefined ? parseFloat(selectedItem.sgstRate) : (gstRate / 2);

    const priceAfterDiscount = unitPrice - discount;
    const totalAmount = quantity * priceAfterDiscount + freight;
    const cgstAmount = round(totalAmount * (cgstRate / 100));
    const sgstAmount = round(totalAmount * (sgstRate / 100));
    // GST Amount is the sum of CGST and SGST.
    const gstAmount = cgstAmount + sgstAmount;

    const updatedItem = {
      item: itemId,
      itemCode: selectedItem.itemCode || "",
      itemName: selectedItem.itemName,
      itemDescription: selectedItem.description || "",
      unitPrice,
      discount,
      managedBy:selectedItem?.managedBy,
      freight,
      gstRate,
      igstRate,
      cgstRate,
      sgstRate,
      taxOption,
      quantity,
      priceAfterDiscount,
      totalAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount: round(totalAmount * (igstRate / 100)),
    };

    Object.entries(updatedItem).forEach(([key, value]) => {
      onItemChange(index, { target: { name: key, value } });
    });
    setShowDropdown(false);
  };

  return (
    <div className="overflow-x-auto ">
      <div className="max-w-[120px] ">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 whitespace-nowrap">Item Code</th>
              <th className="border p-2 whitespace-nowrap">Item Name</th>
              <th className="border p-2 whitespace-nowrap">Item Description</th>
              <th className="border p-2 whitespace-nowrap">Quantity</th>
              <th className="border p-2 whitespace-nowrap">Unit Price</th>
              <th className="border p-2 whitespace-nowrap">Discount</th>
              <th className="border p-2 whitespace-nowrap">Price</th>
              <th className="border p-2 whitespace-nowrap">Freight</th>
              <th className="border p-2 whitespace-nowrap">Total</th>
              <th className="border p-2 whitespace-nowrap">Tax Option</th>
              {globalTaxOption === "GST" && (
                <>
                  <th className="border p-2 whitespace-nowrap">GST Rate (%)</th>
                  <th className="border p-2 whitespace-nowrap">GST Amount </th>
                  <th className="border p-2 whitespace-nowrap">CGST Amount</th>
                  <th className="border p-2 whitespace-nowrap">SGST Amount</th>
                </>
              )}
              {globalTaxOption === "IGST" && (
                <>
                  <th className="border p-2 whitespace-nowrap">IGST Rate (%)</th>
                  <th className="border p-2 whitespace-nowrap">IGST Amount</th>
                </>
              )}
              <th className="border p-2 whitespace-nowrap">Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              // Re-calculate tax amounts on the fly for display.
              const computedValues = computeItemValues(item);
              return (
                <tr key={index} className="border-t">
                  {/* Standard item fields */}
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={item.itemCode ?? ""}
                      onChange={(e) => onItemChange(index, e)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border relative">
                    <input
                      type="text"
                      value={item.itemName ?? ""}
                      onChange={(e) => handleSearchChange(index, e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="Search Item Name"
                    />
                    {showDropdown && (
                      <div className="absolute bg-white border w-full max-h-40 overflow-y-auto shadow-lg rounded z-10">
                        {filteredItems.map((filteredItem) => (
                          <div
                            key={filteredItem.itemCode}
                            className="p-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                            onClick={() => handleItemSelect(index, filteredItem)}
                          >
                            {filteredItem.itemName}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      name="itemDescription"
                      value={item.itemDescription ?? ""}
                      onChange={(e) => onItemChange(index, e)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity ?? 0}
                      onChange={(e) => handleFieldChange(index, "quantity", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice ?? 0}
                      onChange={(e) => handleFieldChange(index, "unitPrice", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="discount"
                      value={item.discount ?? 0}
                      onChange={(e) => handleFieldChange(index, "discount", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="priceAfterDiscount"
                      value={
                        item.priceAfterDiscount !== undefined
                          ? round(item.priceAfterDiscount)
                          : round((item.unitPrice ?? 0) - (item.discount ?? 0))
                      }
                      readOnly
                      className="w-full p-1 border rounded bg-gray-100"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="freight"
                      value={item.freight ?? 0}
                      onChange={(e) => handleFieldChange(index, "freight", e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="totalAmount"
                      value={item.totalAmount !== undefined ? round(item.totalAmount) : 0}
                      readOnly
                      className="w-full p-1 border rounded bg-gray-100"
                    />
                  </td>
                  {/* Tax Option Dropdown */}
                  <td className="p-2 border">
                    <select
                      name="taxOption"
                      value={item.taxOption || "GST"}
                      onChange={(e) => handleTaxOptionChange(index, e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="GST">GST</option>
                      <option value="IGST">IGST</option>
                    </select>
                  </td>
                  {item.taxOption === "GST" && (
                    <>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="gstRate"
                          value={item.gstRate ?? 0}
                          onChange={(e) => handleGstRateChange(index, e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="gstAmount"
                          value={computedValues.gstAmount}
                          readOnly
                          className="w-full p-1 border rounded bg-gray-100"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="cgstAmount"
                          value={computedValues.cgstAmount}
                          readOnly
                          className="w-full p-1 border rounded bg-gray-100"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="sgstAmount"
                          value={computedValues.sgstAmount}
                          readOnly
                          className="w-full p-1 border rounded bg-gray-100"
                        />
                      </td>
                    </>
                  )}
                  {item.taxOption === "IGST" && (
                    <>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="igstRate"
                          value={item.igstRate ?? 0}
                          onChange={(e) => handleIgstRateChange(index, e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="igstAmount"
                          value={computedValues.igstAmount}
                          readOnly
                          className="w-full p-1 border rounded bg-gray-100"
                        />
                      </td>
                    </>
                  )}
                  {/* Warehouse */}
                  <td className="p-2 border relative">
                    <input
                      type="text"
                      value={item.warehouseName || ""}
                      onChange={(e) => handleSearchChangeWarehouse(index, e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="Search Warehouse"
                    />
                    {showWarehouseDropdown && (
                      <div className="absolute bg-white border w-full max-h-40 overflow-y-auto shadow-lg rounded z-10">
                        {filteredWarehouses.map((filteredWh) => (
                          <div
                            key={filteredWh.warehouseCode}
                            className="p-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                            onClick={() => handleWarehouseSelect(index, filteredWh)}
                          >
                            {filteredWh.warehouseName} ({filteredWh.warehouseCode})
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4">
          {onAddItem && (
            <button
              onClick={onAddItem}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemSection;






















// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// // Helper function to round a number to two decimal places.
// const round = (num, decimals = 2) => {
//   const n = Number(num);
//   if (isNaN(n)) return 0;
//   return Number(n.toFixed(decimals));
// };

// // Computes derived fields based on an item object.
// // For GST, the function computes CGST and SGST amounts (defaulting each to half of the gstRate)
// // and then sums them to return the GST Amount.
// const computeItemValues = (item) => {
//   const quantity = parseFloat(item.quantity) || 0;
//   const unitPrice = parseFloat(item.unitPrice) || 0;
//   const discount = parseFloat(item.discount) || 0;
//   const freight = parseFloat(item.freight) || 0;
//   const priceAfterDiscount = round(unitPrice - discount);
//   const totalAmount = round(quantity * priceAfterDiscount + freight);

//   if (item.taxOption === "GST") {
//     const gstRate = item.gstRate !== undefined ? parseFloat(item.gstRate) : 0;
//     const cgstRate = item.cgstRate !== undefined ? parseFloat(item.cgstRate) : (gstRate / 2);
//     const sgstRate = item.sgstRate !== undefined ? parseFloat(item.sgstRate) : (gstRate / 2);
//     const cgstAmount = round(totalAmount * (cgstRate / 100));
//     const sgstAmount = round(totalAmount * (sgstRate / 100));
//     // GST Amount is the sum of CGST and SGST amounts.
//     const gstAmount = cgstAmount + sgstAmount;
//     return { priceAfterDiscount, totalAmount, gstAmount, cgstAmount, sgstAmount, igstAmount: 0 };
//   } else if (item.taxOption === "IGST") {
//     let igstRate = item.igstRate;
//     if (igstRate === undefined || parseFloat(igstRate) === 0) {
//       igstRate = item.gstRate !== undefined ? parseFloat(item.gstRate) : 0;
//     } else {
//       igstRate = parseFloat(igstRate);
//     }
//     const igstAmount = round(totalAmount * (igstRate / 100));
//     return { priceAfterDiscount, totalAmount, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount };
//   }
//   return { priceAfterDiscount, totalAmount, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0 };
// };

// const ItemSection = ({ items, onItemChange, onAddItem, setFormData }) => {
//   const [apiItems, setApiItems] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [filteredWarehouses, setFilteredWarehouses] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

//   // Fetch items from API on mount.
//   useEffect(() => {
//     axios
//       .get("/api/items")
//       .then((res) => setApiItems(res.data))
//       .catch((err) => console.error("Error fetching items:", err));
//   }, []);

//   // Fetch warehouses from API on mount.
//   useEffect(() => {
//     axios
//       .get("/api/warehouse")
//       .then((res) => setWarehouses(res.data))
//       .catch((err) => console.error("Error fetching warehouses:", err));
//   }, []);

//   // For header display, assume all rows use the same tax option as the first item.
//   const globalTaxOption = items && items.length > 0 ? items[0].taxOption || "GST" : "GST";

//   const handleSearchChange = (index, value) => {
//     onItemChange(index, { target: { name: "itemName", value } });
//     if (value.length > 0) {
//       setFilteredItems(
//         apiItems.filter((itm) =>
//           itm.itemName.toLowerCase().includes(value.toLowerCase())
//         )
//       );
//       setShowDropdown(true);
//     } else {
//       setShowDropdown(false);
//     }
//   };

//   const handleSearchChangeWarehouse = (index, value) => {
//     onItemChange(index, { target: { name: "warehouseName", value } });
//     if (value.length > 0) {
//       setFilteredWarehouses(
//         warehouses.filter((wh) =>
//           wh.warehouseName.toLowerCase().includes(value.toLowerCase()) ||
//           wh.warehouseCode.toLowerCase().includes(value.toLowerCase())
//         )
//       );
//       setShowWarehouseDropdown(true);
//     } else {
//       setShowWarehouseDropdown(false);
//     }
//   };

//   const handleWarehouseSelect = (index, selectedWarehouse) => {
//     onItemChange(index, { target: { name: "warehouse", value: selectedWarehouse._id } });
//     onItemChange(index, { target: { name: "warehouseName", value: selectedWarehouse.warehouseName } });
//     onItemChange(index, { target: { name: "warehouseCode", value: selectedWarehouse.warehouseCode } });
//     setShowWarehouseDropdown(false);
//   };

//   // Generic update for numeric fields.
//   const handleFieldChange = (index, field, value) => {
//     const newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
//     const currentItem = items[index] || {};
//     const updatedItem = { ...currentItem, [field]: newValue };
//     const computed = computeItemValues(updatedItem);
//     onItemChange(index, { target: { name: field, value: newValue } });
//     onItemChange(index, { target: { name: "priceAfterDiscount", value: computed.priceAfterDiscount } });
//     onItemChange(index, { target: { name: "totalAmount", value: computed.totalAmount } });
//     onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
//     onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
//     onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
//     onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
//   };

//   // Update GST rate.
//   const handleGstRateChange = (index, value) => {
//     const newGstRate = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
//     const currentItem = items[index] || {};
//     const updatedItem = { ...currentItem, gstRate: newGstRate };
//     const computed = computeItemValues(updatedItem);
//     onItemChange(index, { target: { name: "gstRate", value: newGstRate } });
//     // Update GST, CGST and SGST amounts.
//     onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
//     onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
//     onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
//   };

//   // Update IGST rate.
//   const handleIgstRateChange = (index, value) => {
//     const newIgstRate = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
//     const currentItem = items[index] || {};
//     const updatedItem = { ...currentItem, igstRate: newIgstRate };
//     const computed = computeItemValues(updatedItem);
//     onItemChange(index, { target: { name: "igstRate", value: newIgstRate } });
//     onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
//   };

//   // Change tax option.
//   // When switching to IGST, auto–set igstRate if missing.
//   const handleTaxOptionChange = (index, value) => {
//     onItemChange(index, { target: { name: "taxOption", value } });
//     const currentItem = items[index] || {};
//     let updatedItem = { ...currentItem, taxOption: value };
//     if (value === "IGST" && (!currentItem.igstRate || parseFloat(currentItem.igstRate) === 0)) {
//       updatedItem.igstRate = currentItem.gstRate || 0;
//       onItemChange(index, { target: { name: "igstRate", value: updatedItem.igstRate } });
//     }
//     const computed = computeItemValues(updatedItem);
//     onItemChange(index, { target: { name: "priceAfterDiscount", value: computed.priceAfterDiscount } });
//     onItemChange(index, { target: { name: "totalAmount", value: computed.totalAmount } });
//     onItemChange(index, { target: { name: "gstAmount", value: computed.gstAmount } });
//     onItemChange(index, { target: { name: "cgstAmount", value: computed.cgstAmount } });
//     onItemChange(index, { target: { name: "sgstAmount", value: computed.sgstAmount } });
//     onItemChange(index, { target: { name: "igstAmount", value: computed.igstAmount } });
//   };

//   // When an item is selected from the search dropdown.
//   const handleItemSelect = (index, selectedItem) => {
//     const itemId = selectedItem._id;
//     if (!itemId) {
//       console.error("Selected item does not have a valid _id.");
//       return;
//     }
//     const unitPrice = parseFloat(selectedItem.unitPrice) || 0;
//     const discount = parseFloat(selectedItem.discount) || 0;
//     const freight = parseFloat(selectedItem.freight) || 0;
//     const quantity = 1; // default quantity

//     const taxOption = selectedItem.taxOption || "GST";
//     const gstRate = selectedItem.gstRate !== undefined ? parseFloat(selectedItem.gstRate) : 0;
//     let igstRate = 0;
//     if (taxOption === "IGST") {
//       igstRate =
//         selectedItem.igstRate !== undefined && parseFloat(selectedItem.igstRate) !== 0
//           ? parseFloat(selectedItem.igstRate)
//           : gstRate;
//     }
//     const cgstRate = selectedItem.cgstRate !== undefined ? parseFloat(selectedItem.cgstRate) : (gstRate / 2);
//     const sgstRate = selectedItem.sgstRate !== undefined ? parseFloat(selectedItem.sgstRate) : (gstRate / 2);

//     const priceAfterDiscount = unitPrice - discount;
//     const totalAmount = quantity * priceAfterDiscount + freight;
//     const cgstAmount = round(totalAmount * (cgstRate / 100));
//     const sgstAmount = round(totalAmount * (sgstRate / 100));
//     // GST Amount is the sum of CGST and SGST.
//     const gstAmount = cgstAmount + sgstAmount;

//     const updatedItem = {
//       item: itemId,
//       itemCode: selectedItem.itemCode || "",
//       itemName: selectedItem.itemName,
//       itemDescription: selectedItem.description || "",
//       unitPrice,
//       discount,
//       freight,
//       gstRate,
//       igstRate,
//       cgstRate,
//       sgstRate,
//       taxOption,
//       quantity,
//       priceAfterDiscount,
//       totalAmount,
//       gstAmount,
//       cgstAmount,
//       sgstAmount,
//       igstAmount: round(totalAmount * (igstRate / 100)),
//       // Initialize batches from inventory if provided,
//       // otherwise an empty array.
//       batches: selectedItem.batches || []
//     };

//     Object.entries(updatedItem).forEach(([key, value]) => {
//       onItemChange(index, { target: { name: key, value } });
//     });
//     setShowDropdown(false);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <div className="max-w-[1200px] mx-auto">
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2 whitespace-nowrap">Item Code</th>
//               <th className="border p-2 whitespace-nowrap">Item Name</th>
//               <th className="border p-2 whitespace-nowrap">Item Description</th>
//               <th className="border p-2 whitespace-nowrap">Quantity</th>
//               <th className="border p-2 whitespace-nowrap">Unit Price</th>
//               <th className="border p-2 whitespace-nowrap">Discount</th>
//               <th className="border p-2 whitespace-nowrap">Price</th>
//               <th className="border p-2 whitespace-nowrap">Freight</th>
//               <th className="border p-2 whitespace-nowrap">Total</th>
//               <th className="border p-2 whitespace-nowrap">Tax Option</th>
//               {globalTaxOption === "GST" && (
//                 <>
//                   <th className="border p-2 whitespace-nowrap">GST Rate (%)</th>
//                   <th className="border p-2 whitespace-nowrap">GST Amount</th>
//                   <th className="border p-2 whitespace-nowrap">CGST Amount</th>
//                   <th className="border p-2 whitespace-nowrap">SGST Amount</th>
//                 </>
//               )}
//               {globalTaxOption === "IGST" && (
//                 <>
//                   <th className="border p-2 whitespace-nowrap">IGST Rate (%)</th>
//                   <th className="border p-2 whitespace-nowrap">IGST Amount</th>
//                 </>
//               )}
//               <th className="border p-2 whitespace-nowrap">Warehouse</th>
//               <th className="border p-2 whitespace-nowrap">Batch set</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => {
//               // Re-calculate tax amounts on the fly for display.
//               const computedValues = computeItemValues(item);
//               // Determine column count for batch row.
//               const taxOpt = item.taxOption || "GST";
//               const colCount = taxOpt === "GST" ? 15 : 13;
//               return (
//                 <React.Fragment key={index}>
//                   <tr className="border-t">
//                     {/* Standard item fields */}
//                     <td className="p-2 border">
//                       <input
//                         type="text"
//                         value={item.itemCode ?? ""}
//                         onChange={(e) => onItemChange(index, e)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border relative">
//                       <input
//                         type="text"
//                         value={item.itemName ?? ""}
//                         onChange={(e) => handleSearchChange(index, e.target.value)}
//                         className="w-full p-1 border rounded"
//                         placeholder="Search Item Name"
//                       />
//                       {showDropdown && (
//                         <div className="absolute bg-white border w-full max-h-40 overflow-y-auto shadow-lg rounded z-10">
//                           {filteredItems.map((filteredItem) => (
//                             <div
//                               key={filteredItem.itemCode}
//                               className="p-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
//                               onClick={() => handleItemSelect(index, filteredItem)}
//                             >
//                               {filteredItem.itemName}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </td>
                    
//                     <td className="p-2 border">
//                       <input
//                         type="text"
//                         name="itemDescription"
//                         value={item.itemDescription ?? ""}
//                         onChange={(e) => onItemChange(index, e)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="quantity"
//                         value={item.quantity ?? 0}
//                         onChange={(e) => handleFieldChange(index, "quantity", e.target.value)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="unitPrice"
//                         value={item.unitPrice ?? 0}
//                         onChange={(e) => handleFieldChange(index, "unitPrice", e.target.value)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="discount"
//                         value={item.discount ?? 0}
//                         onChange={(e) => handleFieldChange(index, "discount", e.target.value)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="priceAfterDiscount"
//                         value={
//                           item.priceAfterDiscount !== undefined
//                             ? round(item.priceAfterDiscount)
//                             : round((item.unitPrice ?? 0) - (item.discount ?? 0))
//                         }
//                         readOnly
//                         className="w-full p-1 border rounded bg-gray-100"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="freight"
//                         value={item.freight ?? 0}
//                         onChange={(e) => handleFieldChange(index, "freight", e.target.value)}
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2 border">
//                       <input
//                         type="number"
//                         name="totalAmount"
//                         value={item.totalAmount !== undefined ? round(item.totalAmount) : 0}
//                         readOnly
//                         className="w-full p-1 border rounded bg-gray-100"
//                       />
//                     </td>
//                     {/* Tax Option Dropdown */}
//                     <td className="p-2 border">
//                       <select
//                         name="taxOption"
//                         value={item.taxOption || "GST"}
//                         onChange={(e) => handleTaxOptionChange(index, e.target.value)}
//                         className="w-full p-1 border rounded"
//                       >
//                         <option value="GST">GST</option>
//                         <option value="IGST">IGST</option>
//                       </select>
//                     </td>
//                     {item.taxOption === "GST" && (
//                       <>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="gstRate"
//                             value={item.gstRate ?? 0}
//                             onChange={(e) => handleGstRateChange(index, e.target.value)}
//                             className="w-full p-1 border rounded"
//                           />
//                         </td>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="gstAmount"
//                             value={computedValues.gstAmount}
//                             readOnly
//                             className="w-full p-1 border rounded bg-gray-100"
//                           />
//                         </td>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="cgstAmount"
//                             value={computedValues.cgstAmount}
//                             readOnly
//                             className="w-full p-1 border rounded bg-gray-100"
//                           />
//                         </td>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="sgstAmount"
//                             value={computedValues.sgstAmount}
//                             readOnly
//                             className="w-full p-1 border rounded bg-gray-100"
//                           />
//                         </td>
//                       </>
//                     )}
//                     {item.taxOption === "IGST" && (
//                       <>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="igstRate"
//                             value={item.igstRate ?? 0}
//                             onChange={(e) => handleIgstRateChange(index, e.target.value)}
//                             className="w-full p-1 border rounded"
//                           />
//                         </td>
//                         <td className="p-2 border">
//                           <input
//                             type="number"
//                             name="igstAmount"
//                             value={computedValues.igstAmount}
//                             readOnly
//                             className="w-full p-1 border rounded bg-gray-100"
//                           />
//                         </td>
//                       </>
//                     )}
//                     {/* Warehouse */}
//                     <td className="p-2 border relative">
//                       <input
//                         type="text"
//                         value={item.warehouseName || ""}
//                         onChange={(e) => handleSearchChangeWarehouse(index, e.target.value)}
//                         className="w-full p-1 border rounded"
//                         placeholder="Search Warehouse"
//                       />
//                       {showWarehouseDropdown && (
//                         <div className="absolute bg-white border w-full max-h-40 overflow-y-auto shadow-lg rounded z-10">
//                           {filteredWarehouses.map((filteredWh) => (
//                             <div
//                               key={filteredWh.warehouseCode}
//                               className="p-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
//                               onClick={() => handleWarehouseSelect(index, filteredWh)}
//                             >
//                               {filteredWh.warehouseName} ({filteredWh.warehouseCode})
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </td>
//                     {/* Batch Dropdown */}
//                     <td className="p-2 border">
//                       {item.batches && item.batches.length > 0 ? (
//                         <select
//                           name="selectedBatch"
//                           value={item.selectedBatch || ""}
//                           onChange={(e) => onItemChange(index, e)}
//                           className="w-full p-1 border rounded"
//                         >
//                           <option value="">Select Batch</option>
//                           {item.batches.map((batch) => {
//                             // Calculate available quantity as quantity - committed.
//                             const available = batch.quantity - (batch.committed || 0);
//                             return (
//                               <option key={batch.batchNumber} value={batch.batchNumber}>
//                                 {batch.batchNumber} (Avail: {available})
//                               </option>
//                             );
//                           })}
//                         </select>
//                       ) : (
//                         "No Batch"
//                       )}
//                     </td>
//                   </tr>
//                   {/* Additional row for batch allocation */}
//                   {item.batches && item.batches.length > 0 && (
//                     <tr>
//                       <td colSpan={colCount} className="bg-gray-50 p-2">
//                         <div className="flex flex-col">
//                           <h4 className="font-medium mb-2">Batch Allocation</h4>
//                           {item.batches.map((batch, batchIndex) => {
//                             // Calculate available quantity as quantity - committed.
//                             const available = batch.quantity - (batch.committed || 0);
//                             return (
//                               <div key={batchIndex} className="flex items-center gap-4 mb-1">
//                                 <span className="font-medium">{batch.batchNumber}</span>
//                                 <span>Available: {available}</span>
//                                 <input
//                                   type="number"
//                                   value={batch.allocatedQuantity || 0}
//                                   onChange={(e) => {
//                                     const allocated = parseFloat(e.target.value) || 0;
//                                     // Update allocated quantity using setFormData.
//                                     setFormData((prev) => {
//                                       const updatedItems = [...prev.items];
//                                       updatedItems[index].batches[batchIndex].allocatedQuantity = allocated;
//                                       return { ...prev, items: updatedItems };
//                                     });
//                                   }}
//                                   className="w-20 p-1 border rounded"
//                                 />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//         <div className="mt-4">
//           {onAddItem && (
//             <button
//               onClick={onAddItem}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Item
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemSection;











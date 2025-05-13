"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import ItemSection from "@/components/ItemSection";
import CustomerSearch from "@/components/CustomerSearch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// BatchModal component: Fetches available batches for the given item.
function BatchModal({ itemsbatch, onClose, onUpdateBatch }) {
  const { item, warehouse, itemName, quantity: parentQuantity } = itemsbatch;
  const effectiveItemId = item;
  const effectiveWarehouseId = warehouse;

  const [inventory, setInventory] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  // Force allocation to 1 if parent's quantity is 1.
  const [quantity, setQuantity] = useState(parentQuantity === 1 ? 1 : 1);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch(
          `/api/inventory/${effectiveItemId}/${effectiveWarehouseId}`
        );
        if (!response.ok) throw new Error("Failed to fetch inventory");
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventory({ batches: [] });
      }
    }
    if (effectiveItemId && effectiveWarehouseId) {
      fetchInventory();
    } else {
      setInventory({ batches: [] });
    }
  }, [effectiveItemId, effectiveWarehouseId]);

  const handleConfirm = () => {
    if (hasConfirmed) return;
    setHasConfirmed(true);
    const finalQuantity = parentQuantity === 1 ? 1 : quantity;
    if (!selectedBatch || finalQuantity <= 0) {
      toast.error("Please select a batch and enter a valid quantity");
      return;
    }
    if (finalQuantity > selectedBatch.quantity) {
      toast.error("Entered quantity exceeds available batch quantity");
      return;
    }
    onUpdateBatch(selectedBatch, finalQuantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Select Batch for {itemName}</h2>
        {!inventory ? (
          <p>Loading inventory...</p>
        ) : inventory.batches.length === 0 ? (
          <p>No batches available</p>
        ) : (
          <>
            <label className="block mt-4">Select Batch:</label>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) =>
                setSelectedBatch(e.target.value ? JSON.parse(e.target.value) : null)
              }
            >
              <option value="">-- Select --</option>
              {inventory.batches.map((batch, index) => (
                <option key={index} value={JSON.stringify(batch)}>
                  {batch.batchNumber} - {batch.quantity} available
                </option>
              ))}
            </select>
            {selectedBatch && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                <p>
                  <strong>Batch Number:</strong> {selectedBatch.batchNumber}
                </p>
                <p>
                  <strong>Expiry Date:</strong>{" "}
                  {new Date(selectedBatch.expiryDate).toDateString()}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {selectedBatch.manufacturer}
                </p>
                <p>
                  <strong>Unit Price:</strong> ₹{selectedBatch.unitPrice}
                </p>
                <label className="block mt-2">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedBatch.quantity}
                  value={parentQuantity === 1 ? 1 : quantity}
                  onChange={(e) => {
                    if (parentQuantity !== 1) setQuantity(Number(e.target.value));
                  }}
                  className="border p-2 rounded w-full"
                  disabled={parentQuantity === 1}
                />
                <p className="mt-2">
                  <strong>Total Price:</strong> ₹
                  {((parentQuantity === 1 ? 1 : quantity) * selectedBatch.unitPrice).toFixed(2)}
                </p>
              </div>
            )}
            <button onClick={handleConfirm} className="mt-4 bg-blue-500 text-white p-2 rounded w-full">
              Confirm Batch
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Initial state for Sales Invoice.
const initialInvoiceState = {
  customerCode: "",
  customerName: "",
  contactPerson: "",
  refNumber: "", // Invoice Number.
  salesEmployee: "",
  status: "Pending",
  orderDate: "",
  expectedDeliveryDate: "",
  items: [
    {
      item: "",
      itemCode: "",
      itemId: "",
      itemName: "",
      itemDescription: "",
      quantity: 0, // Total quantity for the item.
      allowedQuantity: 0,
      unitPrice: 0,
      discount: 0,
      freight: 0,
      gstType: 0,
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      tdsAmount: 0,
      batches: [],
      warehouse: "",
      warehouseName: "",
      warehouseCode: "",
      warehouseId: "",
      errorMessage: "",
      taxOption: "GST",
      igstAmount: 0,
      managedByBatch: true,
    },
  ],
  remarks: "",
  freight: 0,
  rounding: 0,
  totalDownPayment: 0,
  appliedAmounts: 0,
  totalBeforeDiscount: 0,
  gstTotal: 0,
  grandTotal: 0,
  openBalance: 0,
  fromQuote: false,
};

function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export default function SalesInvoiceEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [formData, setFormData] = useState(initialInvoiceState);
  // modalItemIndex tracks which item (by index) is currently selecting a batch.
  const [modalItemIndex, setModalItemIndex] = useState(null);

  // Fetch existing Sales Invoice data if editing.
  useEffect(() => {
    if (editId) {
      axios
        .get(`/api/sales-invoice/${editId}`)
        .then((res) => {
          if (res.data.success) {
            const record = res.data.data;
            setFormData({
              ...record,
              orderDate: formatDateForInput(record.orderDate),
              expectedDeliveryDate: formatDateForInput(record.expectedDeliveryDate),
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching sales invoice for edit", err);
          toast.error("Error fetching sales invoice data");
        });
    }
  }, [editId]);

  // Handler for CustomerSearch: update customer fields when a customer is selected.
  const handleCustomerSelect = useCallback((selectedCustomer) => {
    setFormData((prev) => ({
      ...prev,
      customerCode: selectedCustomer.customerCode || "",
      customerName: selectedCustomer.customerName || "",
      contactPerson: selectedCustomer.contactPersonName || "",
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleItemChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, items: updatedItems };
    });
  }, []);

  const addItemRow = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          itemCode: "",
          itemId: "",
          itemName: "",
          itemDescription: "",
          quantity: 0,
          allowedQuantity: 0,
          unitPrice: 0,
          discount: 0,
          freight: 0,
          gstType: 0,
          priceAfterDiscount: 0,
          totalAmount: 0,
          gstAmount: 0,
          tdsAmount: 0,
          batches: [],
          warehouse: "",
          warehouseName: "",
          warehouseCode: "",
          warehouseId: "",
          errorMessage: "",
          taxOption: "GST",
          igstAmount: 0,
          managedByBatch: true,
        },
      ],
    }));
  }, []);

  // Calculation for summary fields.
  useEffect(() => {
    const totalBeforeDiscountCalc = formData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return acc + (unitPrice - discount) * quantity;
    }, 0);

    const totalItemsCalc = formData.items.reduce(
      (acc, item) => acc + (parseFloat(item.totalAmount) || 0),
      0
    );

    const gstTotalCalc = formData.items.reduce((acc, item) => {
      if (item.taxOption === "IGST") {
        return acc + (parseFloat(item.igstAmount) || 0);
      }
      return acc + (parseFloat(item.gstAmount) || 0);
    }, 0);

    const overallFreight = parseFloat(formData.freight) || 0;
    const roundingCalc = parseFloat(formData.rounding) || 0;
    const totalDownPaymentCalc = parseFloat(formData.totalDownPayment) || 0;
    const appliedAmountsCalc = parseFloat(formData.appliedAmounts) || 0;

    const grandTotalCalc = totalItemsCalc + gstTotalCalc + overallFreight + roundingCalc;
    const openBalanceCalc = grandTotalCalc - (totalDownPaymentCalc + appliedAmountsCalc);

    setFormData((prev) => ({
      ...prev,
      totalBeforeDiscount: totalBeforeDiscountCalc,
      gstTotal: gstTotalCalc,
      grandTotal: grandTotalCalc,
      openBalance: openBalanceCalc,
    }));
  }, [
    formData.items,
    formData.freight,
    formData.rounding,
    formData.totalDownPayment,
    formData.appliedAmounts,
  ]);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`/api/sales-invoice/${editId}`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Sales Invoice updated successfully");
      } else {
        await axios.post("/api/sales-invoice", formData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Sales Invoice added successfully");
        setFormData(initialInvoiceState);
      }
      router.push("/admin/sales-invoice-view");
    } catch (error) {
      console.error("Error saving sales invoice:", error);
      toast.error(editId ? "Failed to update sales invoice" : "Error adding sales invoice");
    }
  };

  // Batch update: Update allocated batch for a specific item.
  const handleUpdateBatch = (batch, allocatedQuantity) => {
    const currentAllocatedTotal = formData.items[modalItemIndex].batches.reduce(
      (sum, batchItem) => sum + (batchItem.allocatedQuantity || 0),
      0
    );
    const newTotal = currentAllocatedTotal + allocatedQuantity;
    if (newTotal > formData.items[modalItemIndex].quantity) {
      toast.error("Total allocated quantity exceeds the item quantity");
      return;
    }
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      if (updatedItems[modalItemIndex].quantity === 1) {
        updatedItems[modalItemIndex].batches = [
          {
            batchCode: batch.batchNumber,
            expiryDate: batch.expiryDate,
            manufacturer: batch.manufacturer,
            allocatedQuantity: 1,
            availableQuantity: batch.quantity,
          },
        ];
      } else {
        const existingIndex = updatedItems[modalItemIndex].batches.findIndex(
          (b) => b.batchCode === batch.batchNumber
        );
        if (existingIndex !== -1) {
          updatedItems[modalItemIndex].batches[existingIndex].allocatedQuantity += allocatedQuantity;
        } else {
          updatedItems[modalItemIndex].batches.push({
            batchCode: batch.batchNumber,
            expiryDate: batch.expiryDate,
            manufacturer: batch.manufacturer,
            allocatedQuantity: allocatedQuantity,
            availableQuantity: batch.quantity,
          });
        }
      }
      return { ...prev, items: updatedItems };
    });
  };

  const openBatchModal = (index) => {
    console.log("Opening Batch Modal for item index:", index);
    setModalItemIndex(index);
  };

  return (
    <div className="m-11 p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">
        {editId ? "Edit Sales Invoice" : "Create Sales Invoice"}
      </h1>
      
      {/* Customer Section */}
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
            <div>
                  <label className="block mb-2 font-medium">Customer Name</label>
                     {formData.customerName ? (
                                  <input
                                    type="text"
                                    name="supplierName"
                                    value={formData.customerName}
                                    readOnly
                                    className="w-full p-2 border rounded bg-gray-100"
                                  />
                                ) : (
                                  <CustomerSearch onSelectCustomer={handleCustomerSelect} />
                                )}
                    
                  </div>
          <div>
            <label className="block mb-2 font-medium">Customer Code</label>
            <input
              type="text"
              name="customerCode"
              value={formData.customerCode || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Invoice Number</label>
            <input
              type="text"
              name="refNumber"
              value={formData.refNumber || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Additional Invoice Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select status (optional)</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Invoice Date</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Expected Payment Date</label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      {/* Items Section */}
      <h2 className="text-xl font-semibold mt-6">Items</h2>
      <div className="flex flex-col m-10 p-5 border rounded-lg shadow-lg">
        <ItemSection
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItemRow}
          setFormData={setFormData}
        />
      </div>
      
      {/* Batch Selection Section (for items managed by batch) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Batch Selection</h2>
        {formData.items.map((item, index) => {
          if (!item.managedByBatch) return null;
          return (
            <div key={index} className="border p-2 my-2">
              <div className="flex items-center justify-between">
                <span>{item.itemName || `Item ${index + 1}`}</span>
                <button
                  onClick={() => {
                    console.log("Opening Batch Modal for item index:", index);
                    openBatchModal(index);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Select Batch
                </button>
              </div>
              {item.batches && item.batches.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Allocated Batches:</p>
                  <ul>
                    {item.batches.map((batch, idx) => (
                      <li key={idx} className="text-xs">
                        {batch.batchCode}: {batch.allocatedQuantity} allocated (Available: {batch.availableQuantity})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Remarks & Sales Employee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Sales Employee</label>
          <input
            type="text"
            name="salesEmployee"
            value={formData.salesEmployee || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Taxable Amount</label>
          <input
            type="number"
            name="totalBeforeDiscount"
            value={
              formData.items.reduce(
                (acc, item) => acc + (parseFloat(item.totalAmount) || 0),
                0
              ).toFixed(2)
            }
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Rounding</label>
          <input
            type="number"
            name="rounding"
            value={formData.rounding || 0}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST</label>
          <input
            type="number"
            name="gstTotal"
            value={formData.gstTotal || 0}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Total Amount</label>
          <input
            type="number"
            name="grandTotal"
            value={formData.grandTotal || 0}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Update
        </button>
        <button
          onClick={() => router.push("/admin/sales-invoice-view")}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Cancel
        </button>
      </div>
      
      {/* Render the Batch Modal if an item is selected for batch editing */}
      {modalItemIndex !== null && (
        <BatchModal
          itemsbatch={formData.items[modalItemIndex]}
          onClose={() => setModalItemIndex(null)}
          onUpdateBatch={handleUpdateBatch}
        />
      )}
      
      <ToastContainer />
    </div>
  );
}



// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";
// import ItemSection from "@/components/ItemSection";
// import SupplierSearch from "@/components/SupplierSearch";
// import Link from "next/link";
// import { FaEdit } from "react-icons/fa";

// const initialState = {
//   supplierCode: "",
//   supplierName: "",
//   contactPerson: "",
//   refNumber: "",
//   status: "Open",
//   postingDate: "",
//   validUntil: "",
//   documentDate: "",
//   items: [
//     {
//       itemCode: "",
//       itemName: "",
//       itemDescription: "",
//       quantity: 0,
//       unitPrice: 0,
//       discount: 0,
//       freight: 0,
//       gstType: 0,
//       priceAfterDiscount: 0,
//       totalAmount: 0,
//       gstAmount: 0,
//       tdsAmount: 0,
//     },
//   ],
//   salesEmployee: "",
//   remarks: "",
//   freight: 0,
//   rounding: 0,
//   totalBeforeDiscount: 0,
//   totalDownPayment: 0,
//   appliedAmounts: 0,
//   gstTotal: 0,
//   grandTotal: 0,
//   openBalance: 0,
// };

// function formatDateForInput(date) {
//   if (!date) return "";
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = ("0" + (d.getMonth() + 1)).slice(-2);
//   const day = ("0" + d.getDate()).slice(-2);
//   return `${year}-${month}-${day}`;
// }

// export default function OrderForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("editId");

//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     if (editId) {
//       axios
//         .get(`/api/sales-invoice/${editId}`)
//         .then((res) => {
//           if (res.data.success) {
//             const record = res.data.data;
//             setFormData({
//               ...record,
//               postingDate: formatDateForInput(record.postingDate),
//               validUntil: formatDateForInput(record.validUntil),
//               documentDate: formatDateForInput(record.documentDate),
//             });
//             console.log(record)
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching purchase-order data for editing:", err);
//         });
//     }
//   }, [editId]);

  

//   const handleSupplierSelect = useCallback((selectedSupplier) => {
//     setFormData((prev) => ({
//       ...prev,
//       supplierCode: selectedSupplier.supplierCode || "",
//       supplierName: selectedSupplier.supplierName || "",
//       contactPerson: selectedSupplier.contactPersonName || "",
//     }));
//   }, []);

//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }, []);

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...formData.items];
//     updatedItems[index][field] = value;
//     setFormData((prev) => ({ ...prev, items: updatedItems }));
//   };
//   const addItemRow = useCallback(() => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           itemCode: "",
//           itemName: "",
//           itemDescription: "",
//           quantity: 0,
//           unitPrice: 0,
//           discount: 0,
//           freight: 0,
//           gstType: 0,
//           priceAfterDiscount: 0,
//           totalAmount: 0,
//           gstAmount: 0,
//           tdsAmount: 0,
//         },
//       ],
//     }));
//   }, []);

//   const handleRemoveItem = (index) => {
//     const updatedItems = formData.items.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, items: updatedItems }));
//   };

//   const handleSubmit = async () => {
//     if (editId) {
//       try {
//         await axios.put(`/api/sales-invoice/${editId}`, formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("sales-invoice updated successfully");
//         router.push("/admin/sales-invoice-view");
//       } catch (error) {
//         console.error("Error updating GRN:", error);
//         alert("Failed to update sales-invoice");
//       }
//     } else {
//       try {
//         await axios.post("/api/sales-invoice", formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("sales-invoice added successfully");
//         setFormData(initialState);
//         router.push("/admin/sales-invoice-view");
//       } catch (error) {
//         console.error("Error adding purchaseInvoice-view:", error);
//         alert("Error adding sales-invoice-view");
//       }
//     }
//   };
//   return (
//     <div className="m-11 p-5 shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit Order" : "Create Order"}
//       </h1>
//       {/* Supplier Section */}
//       <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
//         <div className="grid grid-cols-2 gap-7">
//           <div>
//             <label className="block mb-2 font-medium">Supplier Name</label>
//             <SupplierSearch onSelectSupplier={handleSupplierSelect} />
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Supplier Code</label>
//             <input
//               type="text"
//               name="supplierCode"
//               value={formData.supplierCode || ""}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Contact Person</label>
//             <input
//               type="text"
//               name="contactPerson"
//               value={formData.contactPerson || ""}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Reference Number</label>
//             <input
//               type="text"
//               name="refNumber"
//               value={formData.refNumber || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>
//         {/* Additional Order Info */}
//         <div className="w-full md:w-1/2 space-y-4">
//           <div>
//             <label className="block mb-2 font-medium">Status</label>
//             <select
//               name="status"
//               value={formData.status || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select status (optional)</option>
//               <option value="Open">Open</option>
//               <option value="Closed">Closed</option>
//               <option value="Pending">Pending</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Posting Date</label>
//             <input
//               type="date"
//               name="postingDate"
//               value={formData.postingDate || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Valid Until</label>
//             <input
//               type="date"
//               name="validUntil"
//               value={formData.validUntil || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block mb-2 font-medium">Delivery Date</label>
//             <input
//               type="date"
//               name="documentDate"
//               value={formData.documentDate || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>
//       </div>
//       {/* Items Section */}
//       <h2 className="text-xl font-semibold mt-6">Items</h2>
//       <div className="flex flex-col m-10 p-5 border rounded-lg shadow-lg">
//         <ItemSection
//           items={formData.items}
//           onItemChange={handleItemChange}
//           onAddItem={addItemRow}
//         />
//       </div>
//       {/* Other Form Fields & Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         <div>
//           <label className="block mb-2 font-medium">Sales Employee</label>
//           <input
//             type="text"
//             name="salesEmployee"
//             value={formData.salesEmployee || ""}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-medium">Remarks</label>
//           <textarea
//             name="remarks"
//             value={formData.remarks || ""}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//           ></textarea>
//         </div>
//       </div>
//       {/* Summary Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         <div>
//           <label className="block mb-2 font-medium">Taxable Amount</label>
//           <input
//             type="number"
//             name="taxableAmount"
//             value={formData.items.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)}
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-medium">Rounding</label>
//           <input
//             type="number"
//             name="rounding"
//             value={formData.rounding || 0}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-medium">GST</label>
//           <input
//             type="number"
//             name="gstTotal"
//             value={formData.gstTotal || 0}
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-medium">Total Amount</label>
//           <input
//             type="number"
//             name="grandTotal"
//             value={formData.grandTotal || 0}
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//           />
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
//         >
//           {editId ? "Update" : "Add"}
//         </button>
//         <button
//           onClick={() => router.push("/admin/purchase-order-view")}
//           className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

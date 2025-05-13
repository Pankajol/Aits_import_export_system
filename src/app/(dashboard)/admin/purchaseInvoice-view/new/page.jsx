// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams, useParams } from "next/navigation";
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

// // Helper function to merge the loaded record with the defaults from initialState
// function mergeFormData(record) {
//   return {
//     supplierCode: record.supplierCode || initialState.supplierCode,
//     supplierName: record.supplierName || initialState.supplierName,
//     contactPerson: record.contactPerson || initialState.contactPerson,
//     refNumber: record.refNumber || initialState.refNumber,
//     status: record.status || initialState.status,
//     postingDate: formatDateForInput(record.postingDate),
//     validUntil: formatDateForInput(record.validUntil),
//     documentDate: formatDateForInput(record.documentDate),
//     items: record.items && Array.isArray(record.items)
//       ? record.items.map(item => ({
//           itemCode: item.itemCode || "",
//           itemName: item.itemName || "",
//           itemDescription: item.itemDescription || "",
//           quantity: item.quantity || 0,
//           unitPrice: item.unitPrice || 0,
//           discount: item.discount || 0,
//           freight: item.freight || 0,
//           gstType: item.gstType || 0,
//           priceAfterDiscount: item.priceAfterDiscount || 0,
//           totalAmount: item.totalAmount || 0,
//           gstAmount: item.gstAmount || 0,
//           tdsAmount: item.tdsAmount || 0,
//         }))
//       : initialState.items,
//     salesEmployee: record.salesEmployee || initialState.salesEmployee,
//     remarks: record.remarks || initialState.remarks,
//     freight: record.freight || initialState.freight,
//     rounding: record.rounding || initialState.rounding,
//     totalBeforeDiscount: record.totalBeforeDiscount || initialState.totalBeforeDiscount,
//     totalDownPayment: record.totalDownPayment || initialState.totalDownPayment,
//     appliedAmounts: record.appliedAmounts || initialState.appliedAmounts,
//     gstTotal: record.gstTotal || initialState.gstTotal,
//     grandTotal: record.grandTotal || initialState.grandTotal,
//     openBalance: record.openBalance || initialState.openBalance,
//   };
// }

// export default function GrnForm() {
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("editId");

//   const [formData, setFormData] = useState(initialState);

//   // Load record for editing and merge with defaults so all fields are present
//   useEffect(() => {
//     if (editId) {
//       axios
//         .get(`/api/purchaseInvoice/${editId}`)
//         .then((res) => {
//           if (res.data.success) {
//             const record = res.data.data;
//             const mergedData = mergeFormData(record);
//             setFormData(mergedData);
//             console.log("Loaded record:", mergedData);
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching GRN data for editing:", err);
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
//         await axios.put(`/api/purchaseInvoice/${editId}`, formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("Invoice updated successfully");
//         router.push("/admin/purchaseInvoice-view");
//       } catch (error) {
//         console.error("Error updating GRN:", error);
//         alert("Failed to update GRN");
//       }
//     } else {
//       try {
//         await axios.post("/api/purchaseInvoice", formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("Purchase Invoice added successfully");
//         setFormData(initialState);
//         router.push("/admin/purchaseInvoice-view");
//       } catch (error) {
//         console.error("Error adding Purchase Invoice:", error);
//         alert("Error adding Purchase Invoice");
//       }
//     }
//   };

//   return (
//     <div className="m-11 p-5 shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit Invoice" : "Create Invoice"}
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
//           onRemoveItem={handleRemoveItem}
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
//           onClick={() => router.push("/admin/grn-view")}
//           className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import SupplierSearch from "@/components/SupplierSearch";
import ItemSection from "@/components/ItemSection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  supplierCode: "",
  supplierName: "",
  contactPerson: "",
  invoiceNumber: "",
  refNumber: "",
  status: "Open",
  postingDate: "",
  validUntil: "",
  documentDate: "",
  items: [
    {
      itemCode: "",
      itemName: "",
      itemDescription: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      freight: 0,
      gstType: 0,
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      tdsAmount: 0,
      managedBy: "",
      batches: [],
    },
  ],
  salesEmployee: "",
  remarks: "",
  freight: 0,
  rounding: 0,
  totalBeforeDiscount: 0,
  gstTotal: 0,
  grandTotal: 0,
  openBalance: 0,
};

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

function mergeFormData(record) {
  return {
    supplierCode: record.supplierCode || "",
    supplierName: record.supplierName || "",
    contactPerson: record.contactPerson || "",
    invoiceNumber: record.invoiceNumber || "",
    refNumber: record.refNumber || "",
    status: record.status || "Open",
    postingDate: formatDateForInput(record.postingDate),
    validUntil: formatDateForInput(record.validUntil),
    documentDate: formatDateForInput(record.documentDate),
    items: record.items && Array.isArray(record.items)
      ? record.items.map(item => ({
          itemCode: item.itemCode || "",
          itemName: item.itemName || "",
          itemDescription: item.itemDescription || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          discount: item.discount || 0,
          freight: item.freight || 0,
          gstType: item.gstType || 0,
          priceAfterDiscount: item.priceAfterDiscount || 0,
          totalAmount: item.totalAmount || 0,
          gstAmount: item.gstAmount || 0,
          tdsAmount: item.tdsAmount || 0,
          managedBy: item.managedBy || "",
          batches: item.batches || [],
        }))
      : [],
    salesEmployee: record.salesEmployee || "",
    remarks: record.remarks || "",
    freight: record.freight || 0,
    rounding: record.rounding || 0,
    totalBeforeDiscount: record.totalBeforeDiscount || 0,
    gstTotal: record.gstTotal || 0,
    grandTotal: record.grandTotal || 0,
    openBalance: record.openBalance || 0,
  };
}

export default function PurchaseInvoiceEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const parentRef = useRef(null);

  const [formData, setFormData] = useState(initialState);
  const [barcode, setBarcode] = useState("");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchItemIndex, setSelectedBatchItemIndex] = useState(null);

  // Load record for editing.
  useEffect(() => {
    if (editId) {
      axios
        .get(`/api/purchaseInvoice/${editId}`)
        .then((res) => {
          if (res.data.success) {
            const record = res.data.data;
            const mergedData = mergeFormData(record);
            setFormData(mergedData);
            toast.info("Invoice data loaded for editing.");
          } else {
            toast.error("Invoice not found.");
          }
        })
        .catch((err) => {
          console.error("Error fetching invoice data for editing:", err);
          toast.error("Error loading invoice data.");
        });
    }
  }, [editId]);

  const handleSupplierSelect = useCallback((selectedSupplier) => {
    setFormData((prev) => ({
      ...prev,
      supplierCode: selectedSupplier.supplierCode || "",
      supplierName: selectedSupplier.supplierName || "",
      contactPerson: selectedSupplier.contactPersonName || "",
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemCode: "",
          itemName: "",
          itemDescription: "",
          quantity: 0,
          unitPrice: 0,
          discount: 0,
          freight: 0,
          gstType: 0,
          priceAfterDiscount: 0,
          totalAmount: 0,
          gstAmount: 0,
          tdsAmount: 0,
          managedBy: "",
          batches: [],
        },
      ],
    }));
  }, []);

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Declare handleItemSelect before its usage.
  const handleItemSelect = useCallback(async (index, selectedItem) => {
    if (!selectedItem._id) {
      toast.error("Selected item does not have a valid ID.");
      return;
    }
    let managedBy = selectedItem.managedBy;
    if (!managedBy || managedBy.trim() === "") {
      try {
        const res = await axios.get(`/api/items/${selectedItem._id}`);
        if (res.data.success) {
          managedBy = res.data.data.managedBy;
          console.log(`Fetched managedBy for ${selectedItem.itemCode}:`, managedBy);
        }
      } catch (error) {
        console.error("Error fetching item master details:", error);
        managedBy = "";
      }
    } else {
      console.log(`Using managedBy from selected item for ${selectedItem.itemCode}:`, managedBy);
    }
    const unitPrice = Number(selectedItem.unitPrice) || 0;
    const discount = Number(selectedItem.discount) || 0;
    const freight = Number(selectedItem.freight) || 0;
    const quantity = 1;
    const taxOption = selectedItem.taxOption || "GST";
    const gstRate = selectedItem.gstRate ? Number(selectedItem.gstRate) : 0;
    const priceAfterDiscount = unitPrice - discount;
    const totalAmount = quantity * priceAfterDiscount + freight;
    const cgstRate = selectedItem.cgstRate ? Number(selectedItem.cgstRate) : gstRate / 2;
    const sgstRate = selectedItem.sgstRate ? Number(selectedItem.sgstRate) : gstRate / 2;
    const cgstAmount = totalAmount * (cgstRate / 100);
    const sgstAmount = totalAmount * (sgstRate / 100);
    const gstAmount = cgstAmount + sgstAmount;
    const igstAmount = taxOption === "IGST" ? totalAmount * (gstRate / 100) : 0;

    const updatedItem = {
      item: selectedItem._id,
      itemCode: selectedItem.itemCode || "",
      itemName: selectedItem.itemName,
      itemDescription: selectedItem.description || "",
      unitPrice,
      discount,
      freight,
      gstType: selectedItem.gstType || 0,
      priceAfterDiscount,
      totalAmount,
      gstAmount,
      tdsAmount: 0,
      managedBy,
      batches: managedBy && managedBy.trim().toLowerCase() === "batch" ? [] : [],
    };

    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], ...updatedItem };
      return { ...prev, items: updatedItems };
    });
  }, []);

  const handleBarcodeScan = useCallback(async () => {
    if (!barcode) {
      toast.error("Please enter a barcode.");
      return;
    }
    try {
      const response = await axios.get(`/api/barcode/${barcode}`);
      if (response.data && response.data.success) {
        const scannedItem = response.data.data;
        addItemRow();
        setTimeout(() => {
          const newIndex = formData.items.length;
          handleItemSelect(newIndex, scannedItem);
        }, 0);
        toast.success("Item added via barcode.");
      } else {
        toast.error("Item not found for this barcode.");
      }
    } catch (error) {
      console.error("Barcode scan error", error);
      toast.error("Error scanning barcode.");
    }
  }, [barcode, formData.items, addItemRow, handleItemSelect]);

  // Batch modal handlers.
  const openBatchModal = useCallback((itemIndex) => {
    setSelectedBatchItemIndex(itemIndex);
    setShowBatchModal(true);
  }, []);

  const closeBatchModal = useCallback(() => {
    setShowBatchModal(false);
    setSelectedBatchItemIndex(null);
  }, []);

  const handleBatchEntryChange = useCallback((itemIndex, batchIndex, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      const currentItem = { ...updatedItems[itemIndex] };
      if (!currentItem.batches) currentItem.batches = [];
      const updatedBatches = [...currentItem.batches];
      updatedBatches[batchIndex] = { ...updatedBatches[batchIndex], [field]: value };
      currentItem.batches = updatedBatches;
      updatedItems[itemIndex] = currentItem;
      return { ...prev, items: updatedItems };
    });
  }, []);

  const addBatchEntry = useCallback(() => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      const currentItem = { ...updatedItems[selectedBatchItemIndex] };
      if (!currentItem.batches) currentItem.batches = [];
      const lastEntry = currentItem.batches[currentItem.batches.length - 1];
      if (
        lastEntry &&
        lastEntry.batchNumber === "" &&
        lastEntry.expiryDate === "" &&
        lastEntry.manufacturer === "" &&
        (lastEntry.batchQuantity === 0 || lastEntry.batchQuantity === "")
      ) {
        return { ...prev, items: updatedItems };
      }
      currentItem.batches.push({
        batchNumber: "",
        expiryDate: "",
        manufacturer: "",
        batchQuantity: 0,
      });
      updatedItems[selectedBatchItemIndex] = currentItem;
      return { ...prev, items: updatedItems };
    });
  }, [selectedBatchItemIndex]);

  // Summary Calculation: recalculate totals including freight and rounding.
  useEffect(() => {
    const totalBeforeDiscountCalc = formData.items.reduce((acc, item) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const discount = Number(item.discount) || 0;
      const quantity = Number(item.quantity) || 1;
      return acc + (unitPrice - discount) * quantity;
    }, 0);
    const totalItemsCalc = formData.items.reduce(
      (acc, item) => acc + (Number(item.totalAmount) || 0),
      0
    );
    const gstTotalCalc = formData.items.reduce((acc, item) => {
      if (item.taxOption === "IGST") {
        return acc + (Number(item.igstAmount) || 0);
      }
      return acc + (Number(item.gstAmount) || 0);
    }, 0);
    const freightAdj = Number(formData.freight) || 0;
    const roundingAdj = Number(formData.rounding) || 0;
    const grandTotalCalc = totalItemsCalc + gstTotalCalc + freightAdj + roundingAdj;
    setFormData((prev) => ({
      ...prev,
      totalBeforeDiscount: totalBeforeDiscountCalc,
      gstTotal: gstTotalCalc,
      grandTotal: grandTotalCalc,
    }));
  }, [formData.items, formData.freight, formData.rounding]);

  const handleSubmit = async () => {
    if (editId) {
      try {
        await axios.put(`/api/purchaseInvoice/${editId}`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Invoice updated successfully");
        router.push("/admin/purchaseInvoice-view");
      } catch (error) {
        console.error("Error updating invoice:", error);
        alert("Failed to update invoice");
      }
    } else {
      try {
        await axios.post("/api/purchaseInvoice", formData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Purchase Invoice added successfully");
        setFormData(initialState);
        router.push("/admin/purchaseInvoice-view");
      } catch (error) {
        console.error("Error adding Purchase Invoice:", error);
        alert("Error adding Purchase Invoice");
      }
    }
  };

  return (
    <div className="m-11 p-5 shadow-xl" ref={parentRef}>
      <h1 className="text-2xl font-bold mb-4">
        {editId ? "Edit Invoice" : "Create Invoice"}
      </h1>
      {/* Barcode Scan Section */}
      <div className="mb-6 p-4 border rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Barcode Scan</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleBarcodeScan}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Scan Barcode
          </button>
        </div>
      </div>
      {/* Supplier & Invoice Header Section */}
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
          <div>
            <label className="block mb-2 font-medium">Supplier Name</label>
             {formData.supplierName ? (
                          <input
                            type="text"
                            name="supplierName"
                            value={formData.supplierName}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                          />
                        ) : (
                          <SupplierSearch onSelectSupplier={handleSupplierSelect} />
                        )}
            {/* <SupplierSearch onSelectSupplier={handleSupplierSelect} /> */}
          </div>
          <div>
            <label className="block mb-2 font-medium">Supplier Code</label>
            <input
              type="text"
              name="supplierCode"
              value={formData.supplierCode || ""}
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
            <label className="block mb-2 font-medium">Reference Number</label>
            <input
              type="text"
              name="refNumber"
              value={formData.remarks || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Additional Invoice Details */}
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Posting Date</label>
            <input
              type="date"
              name="postingDate"
              value={formData.postingDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Delivery Date</label>
            <input
              type="date"
              name="documentDate"
              value={formData.documentDate || ""}
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
          onRemoveItem={handleRemoveItem}
        />
      </div>
      {/* Batch Modal Trigger */}
      <div className="mb-8">
        {formData.items.map((item, index) =>
          item.itemCode && item.managedBy && item.managedBy.trim().toLowerCase() === "batch" ? (
            <div key={index} className="flex items-center justify-between border p-3 rounded mb-2">
              <div>
                <strong>{item.itemCode} - {item.itemName}</strong>
                <span className="ml-2 text-sm text-gray-600">(Unit Price: {item.unitPrice})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBatchItemIndex(index);
                  setShowBatchModal(true);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Set Batch Details
              </button>
            </div>
          ) : null
        )}
      </div>
      {/* Batch Modal */}
      {showBatchModal && selectedBatchItemIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-2">
              Batch Details for {formData.items[selectedBatchItemIndex].itemCode} - {formData.items[selectedBatchItemIndex].itemName}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Unit Price: {formData.items[selectedBatchItemIndex].unitPrice}
            </p>
            {formData.items[selectedBatchItemIndex].batches.length > 0 ? (
              <table className="w-full table-auto border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Batch Number</th>
                    <th className="border p-2">Expiry Date</th>
                    <th className="border p-2">Manufacturer</th>
                    <th className="border p-2">Batch Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items[selectedBatchItemIndex].batches.map((batch, batchIdx) => (
                    <tr key={batchIdx}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={batch.batchNumber || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(selectedBatchItemIndex, batchIdx, "batchNumber", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          value={batch.expiryDate || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(selectedBatchItemIndex, batchIdx, "expiryDate", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={batch.manufacturer || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(selectedBatchItemIndex, batchIdx, "manufacturer", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={batch.batchQuantity || 0}
                          onChange={(e) =>
                            handleBatchEntryChange(selectedBatchItemIndex, batchIdx, "batchQuantity", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mb-4">No batch entries yet.</p>
            )}
            <button
              type="button"
              onClick={addBatchEntry}
              className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
              Add Batch Entry
            </button>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Additional Invoice Fields & Summary */}
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
            value={formData.totalBeforeDiscount || 0}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
          {/* Editable Freight & Rounding Fields */}
      
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
          <label className="block mb-2 font-medium">GST Total</label>
          <input
            type="number"
            name="gstTotal"
            value={formData.gstTotal || 0}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Grand Total</label>
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
          {editId ? "Update Invoice" : "Add Invoice"}
        </button>
        <button
          onClick={() => router.push("/admin/purchaseInvoice-view")}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Cancel
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

//////////////////////////////////////////////////////////////////////

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams,useParams } from "next/navigation";
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

// export default function GrnForm() {
//   const router = useRouter();
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("editId");

//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     if (editId) {
//       axios
//         .get(`/api/purchaseInvoice/${editId}`)
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
//           console.error("Error fetching GRN data for editing:", err);
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
//         await axios.put(`/api/purchaseInvoice/${editId}`, formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("invoice updated successfully");
//         router.push("/admin/purchaseInvoice-view");
//       } catch (error) {
//         console.error("Error updating GRN:", error);
//         alert("Failed to update GRN");
//       }
//     } else {
//       try {
//         await axios.post("/api/purchaseInvoice", formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("purchaseInvoice added successfully");
//         setFormData(initialState);
//         router.push("/admin/purchaseInvoice-view");
//       } catch (error) {
//         console.error("Error adding purchaseInvoice-view:", error);
//         alert("Error adding purchaseInvoice-view");
//       }
//     }
//   };
//   return (
//     <div className="m-11 p-5 shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit Invoice" : "Create Invoice"}
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
//           onClick={() => router.push("/admin/grn-view")}
//           className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

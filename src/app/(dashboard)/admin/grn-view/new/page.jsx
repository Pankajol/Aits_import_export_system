// import React from 'react'
// import GRNConversionForm from "@/components/GRNConversionForm"

// function page() {
//   return (
//     <div>
//       <GRNConversionForm />
//     </div>
//   )
// }

// export default page





////////////////////////////////////////////////////////////////////////////////

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import SupplierSearch from "@/components/SupplierSearch";
import ItemSection from "@/components/ItemSection";
import { FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initial GRN state – managedBy will be set via the item master.
const initialGRNState = {
  _id: "",
  supplierCode: "",
  supplierName: "",
  contactPerson: "",
  refNumber: "",
  status: "Received",
  postingDate: "",
  validUntil: "",
  documentDate: "",
  items: [
    {
      item: "",
      itemCode: "",
      itemName: "",
      itemDescription: "",
      quantity: 0,
      allowedQuantity: 0,
      receivedQuantity: 0,
      unitPrice: 0,
      discount: 0,
      freight: 0,
      gstRate: 0,
      taxOption: "GST", // or "IGST"
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      managedBy: "", // will be updated from item master
      batches: [],
      errorMessage: "",
    },
  ],
  qualityCheckDetails: [],
  salesEmployee: "",
  remarks: "",
  freight: 0,
  rounding: 0,
  totalBeforeDiscount: 0,
  gstTotal: 0,
  grandTotal: 0,
  purchaseOrderId: "",
};

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const ddMmYyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddMmYyyyRegex.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
}

export default function GRNFormEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEdit = Boolean(editId);
  const parentRef = useRef(null);
  const [grnData, setGrnData] = useState(initialGRNState);
  const [summary, setSummary] = useState({
    totalBeforeDiscount: 0,
    gstTotal: 0,
    grandTotal: 0,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [showQualityCheckForm, setShowQualityCheckForm] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedBatchItemIndex, setSelectedBatchItemIndex] = useState(null);
  const [barcode, setBarcode] = useState("");

  // Load GRN record if editing.
  useEffect(() => {
    if (isEdit) {
      axios
        .get(`/api/grn/${editId}`)
        .then((res) => {
          if (res.data.success) {
            const record = res.data.data;
            setGrnData({
              ...record,
              postingDate: formatDateForInput(record.postingDate),
              validUntil: formatDateForInput(record.validUntil),
              documentDate: formatDateForInput(record.documentDate),
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching GRN for editing:", err);
          toast.error("Error loading GRN data.");
        });
    }
  }, [isEdit, editId]);

  // Debug: log current items to verify managedBy values.
  useEffect(() => {
    console.log("GRN Items:", grnData.items);
  }, [grnData.items]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setGrnData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSupplierSelect = useCallback((selectedSupplier) => {
    setGrnData((prev) => ({
      ...prev,
      supplierCode: selectedSupplier.supplierCode || "",
      supplierName: selectedSupplier.supplierName || "",
      contactPerson: selectedSupplier.contactPersonName || "",
    }));
  }, []);

  const handleQualityCheckChange = useCallback((index, value) => {
    setGrnData((prev) => {
      const updatedQC = [...prev.qualityCheckDetails];
      updatedQC[index] = { ...updatedQC[index], actualValue: value };
      return { ...prev, qualityCheckDetails: updatedQC };
    });
  }, []);

  // When an item is selected, fetch its managedBy from the item master if needed.
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

    // Calculate derived fields.
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
      gstRate,
      taxOption,
      quantity,
      priceAfterDiscount,
      totalAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      managedBy, // set from the item master
      // Only initialize batches if managedBy is exactly "batch"
      batches: managedBy && managedBy.trim().toLowerCase() === "batch" ? [] : [],
    };

    if (selectedItem.qualityCheckDetails && selectedItem.qualityCheckDetails.length > 0) {
      setGrnData((prev) => ({
        ...prev,
        qualityCheckDetails: selectedItem.qualityCheckDetails,
      }));
    } else {
      setGrnData((prev) => ({
        ...prev,
        qualityCheckDetails: [
          { parameter: "Weight", min: "", max: "", actualValue: "" },
          { parameter: "Dimension", min: "", max: "", actualValue: "" },
        ],
      }));
    }

    setGrnData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], ...updatedItem };
      return { ...prev, items: updatedItems };
    });
  }, []);

  const addItemRow = useCallback(() => {
    setGrnData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          itemCode: "",
          itemName: "",
          itemDescription: "",
          quantity: 0,
          allowedQuantity: 0,
          receivedQuantity: 0,
          unitPrice: 0,
          discount: 0,
          freight: 0,
          gstRate: 0,
          taxOption: "GST",
          priceAfterDiscount: 0,
          totalAmount: 0,
          gstAmount: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          managedBy: "",
          batches: [],
          errorMessage: "",
        },
      ],
    }));
  }, []);

  const handleItemChange = useCallback((index, e) => {
    const { name } = e.target;
    let newValue = e.target.value;
    const numericFields = [
      "quantity",
      "receivedQuantity",
      "unitPrice",
      "discount",
      "freight",
      "gstRate",
      "igstRate",
    ];
    if (numericFields.includes(name)) {
      newValue = Number(newValue) || 0;
    }
    setGrnData((prev) => {
      const updatedItems = [...prev.items];
      const currentItem = { ...updatedItems[index] };
      currentItem[name] = newValue;
      // Recalculate derived values.
      const unitPrice = Number(currentItem.unitPrice) || 0;
      const discount = Number(currentItem.discount) || 0;
      const quantity = Number(currentItem.quantity) || 1;
      const freight = Number(currentItem.freight) || 0;
      currentItem.priceAfterDiscount = unitPrice - discount;
      currentItem.totalAmount = quantity * (unitPrice - discount) + freight;
      updatedItems[index] = currentItem;
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
          const newIndex = grnData.items.length;
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
  }, [barcode, grnData.items, addItemRow, handleItemSelect]);

  // Check for items missing managedBy and fetch from item master.
  const unfetchedCount = grnData.items.filter(
    (item) => item.item && (!item.managedBy || item.managedBy.trim() === "")
  ).length;

  useEffect(() => {
    async function checkManagedByForNewItems() {
      const updatedItems = await Promise.all(
        grnData.items.map(async (item) => {
          if (item.item && (!item.managedBy || item.managedBy.trim() === "")) {
            try {
              const res = await axios.get(`/api/items/${item.item}`);
              if (res.data.success) {
                const masterData = res.data.data;
                console.log(`Checked managedBy for ${item.itemCode}:`, masterData.managedBy);
                return { ...item, managedBy: masterData.managedBy, fetchedManagedBy: true };
              }
            } catch (error) {
              console.error("Error fetching managedBy for item", item.item, error);
            }
          }
          return item;
        })
      );
      setGrnData((prev) => ({ ...prev, items: updatedItems }));
    }
    if (unfetchedCount > 0) {
      checkManagedByForNewItems();
    }
  }, [unfetchedCount]);

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
    setGrnData((prev) => {
      const updatedItems = [...prev.items];
      const currentItem = { ...updatedItems[itemIndex] };
      if (!currentItem.batches) currentItem.batches = [];
      const updatedBatches = [...currentItem.batches];
      updatedBatches[batchIndex] = {
        ...updatedBatches[batchIndex],
        [field]: value,
      };
      currentItem.batches = updatedBatches;
      updatedItems[itemIndex] = currentItem;
      return { ...prev, items: updatedItems };
    });
  }, []);

  const addBatchEntry = useCallback(() => {
    setGrnData((prev) => {
      const updatedItems = [...prev.items];
      const currentItem = { ...updatedItems[selectedBatchItemIndex] };
      if (!currentItem.batches) currentItem.batches = [];
      const lastEntry = currentItem.batches[currentItem.batches.length - 1];
      if (
        lastEntry &&
        lastEntry.batchNumber === "" &&
        lastEntry.expiryDate === "" &&
        lastEntry.manufacturer === "" &&
        lastEntry.batchQuantity === 0
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

  // Summary Calculation.
  useEffect(() => {
    const totalBeforeDiscountCalc = grnData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return acc + (unitPrice - discount) * quantity;
    }, 0);
  
    const totalItemsCalc = grnData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return acc + ((unitPrice - discount) * quantity);
    }, 0);
  
    const gstTotalCalc = grnData.items.reduce((acc, item) => {
      if (item.taxOption === "IGST") {
        return acc + (parseFloat(item.igstAmount) || 0);
      }
      return acc + (parseFloat(item.gstAmount) || 0);
    }, 0);
  
    const grandTotalCalc = totalItemsCalc + gstTotalCalc;
    
    setSummary({
      totalBeforeDiscount: totalBeforeDiscountCalc,
      gstTotal: gstTotalCalc,
      grandTotal: grandTotalCalc,
    });
  }, [grnData.items, grnData.freight, grnData.rounding]);

  const handleSaveGRN = useCallback(async () => {
    // Validate each item.
    for (let item of grnData.items) {
      const allowedQty = Number(item.allowedQuantity) || 0;
      if (allowedQty > 0 && Number(item.quantity) > allowedQty) {
        toast.error(
          `For item ${item.itemCode}, GRN quantity (${item.quantity}) exceeds allowed quantity (${allowedQty}).`
        );
        return;
      }
      // For items managed by batch, ensure total batch quantity equals item quantity.
      if (item.managedBy && item.managedBy.toLowerCase() === "batch") {
        const totalBatchQty = (item.batches || []).reduce(
          (sum, batch) => sum + (Number(batch.batchQuantity) || 0),
          0
        );
        if (totalBatchQty !== Number(item.quantity)) {
          toast.error(
            `Batch quantity mismatch for item ${item.itemCode}: total batch quantity (${totalBatchQty}) does not equal item quantity (${item.quantity}).`
          );
          return;
        }
      }
    }
  
    try {
      // Merge summary values into the payload.
      const payload = {
        ...grnData,
        totalBeforeDiscount: summary.totalBeforeDiscount,
        gstTotal: summary.gstTotal,
        grandTotal: summary.grandTotal,
      };
  
      // Clean the payload by removing any _id fields if needed.
      if ("_id" in payload) delete payload._id;
      payload.items = payload.items.map((item) => {
        if ("_id" in item) delete item._id;
        return item;
      });
  
      let response;
      if (isEdit) {
        response = await axios.put(`/api/grn/${editId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success(`GRN updated successfully. GRN ID: ${response.data.grnId}`);
      } else {
        response = await axios.post("/api/grn", payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success(`GRN saved successfully. GRN ID: ${response.data.grnId}`);
      }
      setGrnData(initialGRNState);
      router.push("/admin/grn-view");
    } catch (error) {
      console.error("Error saving GRN:", error);
      toast.error(error.response?.data?.message || "Error saving GRN");
    }
  }, [grnData, summary, isEdit, editId, router]);

  const handleCancel = useCallback(() => {
    setGrnData(initialGRNState);
    toast.info("GRN form cleared.");
  }, []);

  const handleCopyToPO = useCallback(() => {
    sessionStorage.setItem("grnData", JSON.stringify(grnData));
    router.push("/admin/purchase-order");
  }, [grnData, router]);

  // PO COPY: Load PO data from sessionStorage if available.
  useEffect(() => {
    async function loadSessionData() {
      if (typeof window !== "undefined") {
        const poData = sessionStorage.getItem("purchaseOrderData");
        if (poData) {
          try {
            const parsedData = JSON.parse(poData);
            // For each item, if managedBy is missing, fetch from item master.
            for (let i = 0; i < parsedData.items.length; i++) {
              let item = parsedData.items[i];
              if (!item.managedBy || item.managedBy.trim() === "") {
                const res = await axios.get(`/api/items/${item.item}`);
                if (res.data.success) {
                  const masterData = res.data.data;
                  item.managedBy = masterData.managedBy;
                  console.log(`Fetched managedBy for PO item ${item.itemCode}:`, masterData.managedBy);
                } else {
                  console.error("Item master not found for item:", item.item);
                }
              }
            }
            // Update items accordingly.
            parsedData.items = parsedData.items.map((item) => {
              if (item._id) delete item._id;
              return {
                ...item,
                allowedQuantity: item.allowedQuantity || item.quantity,
                managedBy: item.managedBy,
                batches:
                  item.managedBy && item.managedBy.toLowerCase() === "batch"
                    ? item.batches && item.batches.length > 0
                      ? item.batches
                      : [
                          {
                            batchNumber: "",
                            expiryDate: "",
                            manufacturer: "",
                            batchQuantity: 0,
                          },
                        ]
                    : [],
                gstRate: item.gstRate || 0,
                taxOption: item.taxOption || "GST",
                igstRate:
                  item.taxOption === "IGST" && (!item.igstRate || parseFloat(item.igstRate) === 0)
                    ? item.gstRate
                    : item.igstRate || 0,
                cgstRate: item.taxOption === "GST" && !item.cgstRate ? item.gstRate / 2 : item.cgstRate || 0,
                sgstRate: item.taxOption === "GST" && !item.sgstRate ? item.gstRate / 2 : item.sgstRate || 0,
                qualityCheckDetails:
                  item.qualityCheckDetails && item.qualityCheckDetails.length > 0
                    ? item.qualityCheckDetails
                    : [
                        { parameter: "Weight", min: "", max: "", actualValue: "" },
                        { parameter: "Dimension", min: "", max: "", actualValue: "" },
                      ],
              };
            });
            if (parsedData._id) {
              parsedData.purchaseOrderId = parsedData._id;
              delete parsedData._id;
            }
            setGrnData(parsedData);
            sessionStorage.removeItem("purchaseOrderData");
            setIsCopied(true);
            toast.info("PO data loaded into GRN form.");
          } catch (error) {
            console.error("Error parsing PO data:", error);
          }
        }
      }
    }
    loadSessionData();
  }, []);

  return (
    <div ref={parentRef} className="m-11 p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? "Edit GRN" : "GRN Form"}</h1>
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
      {/* Supplier & Document Details */}
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
          <div>
            <label className="block mb-2 font-medium">Supplier Name</label>
            {grnData.supplierName ? (
              <input
                type="text"
                name="supplierName"
                value={grnData.supplierName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            ) : (
              <SupplierSearch onSelectSupplier={handleSupplierSelect} />
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Supplier Code</label>
            <input
              type="text"
              name="supplierCode"
              value={grnData.supplierCode}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={grnData.contactPerson}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Reference Number</label>
            <input
              type="text"
              name="refNumber"
              value={grnData.refNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              value={grnData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select status</option>
              <option value="Received">Received</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Posting Date</label>
            <input
              type="date"
              name="postingDate"
              value={formatDateForInput(grnData.postingDate)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formatDateForInput(grnData.validUntil)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Document Date</label>
            <input
              type="date"
              name="documentDate"
              value={formatDateForInput(grnData.documentDate)}
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
          items={grnData.items}
          onItemChange={handleItemChange}
          onAddItem={addItemRow}
          onItemSelect={handleItemSelect}
        />
      </div>
      {/* Batch Modal Trigger – only for items with managedBy equal to "batch" */}
      <div className="mb-8">
        {grnData.items.map((item, index) =>
          item.item &&
          item.managedBy &&
          item.managedBy.trim().toLowerCase() === "batch" ? (
            <div key={index} className="flex items-center justify-between border p-3 rounded mb-2">
              <div>
                <strong>
                  {item.itemCode} - {item.itemName}
                </strong>
                <span className="ml-2 text-sm text-gray-600">
                  (Unit Price: {item.unitPrice})
                </span>
              </div>
              <button
                type="button"
                onClick={() => openBatchModal(index)}
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
              Batch Details for{" "}
              {grnData.items[selectedBatchItemIndex].itemCode} -{" "}
              {grnData.items[selectedBatchItemIndex].itemName}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Unit Price: {grnData.items[selectedBatchItemIndex].unitPrice}
            </p>
            {grnData.items[selectedBatchItemIndex].batches.length > 0 ? (
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
                  {grnData.items[selectedBatchItemIndex].batches.map((batch, batchIdx) => (
                    <tr key={batchIdx}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={batch.batchNumber || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(
                              selectedBatchItemIndex,
                              batchIdx,
                              "batchNumber",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          value={batch.expiryDate || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(
                              selectedBatchItemIndex,
                              batchIdx,
                              "expiryDate",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={batch.manufacturer || ""}
                          onChange={(e) =>
                            handleBatchEntryChange(
                              selectedBatchItemIndex,
                              batchIdx,
                              "manufacturer",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={batch.batchQuantity || 0}
                          onChange={(e) =>
                            handleBatchEntryChange(
                              selectedBatchItemIndex,
                              batchIdx,
                              "batchQuantity",
                              e.target.value
                            )
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
                onClick={closeBatchModal}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sales Employee & Remarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Sales Employee</label>
          <input
            type="text"
            name="salesEmployee"
            value={grnData.salesEmployee}
            onChange={handleInputChange}
            placeholder="Enter sales employee name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Remarks</label>
          <textarea
            name="remarks"
            value={grnData.remarks}
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
            value={summary.totalBeforeDiscount}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Rounding</label>
          <input
            type="number"
            name="rounding"
            value={grnData.rounding}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST Total</label>
          <input
            type="number"
            name="gstTotal"
            value={summary.gstTotal}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Grand Total</label>
          <input
            type="number"
            name="grandTotal"
            value={summary.grandTotal}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <button
          onClick={handleSaveGRN}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          {isEdit ? "Update GRN" : "Save GRN"}
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Cancel
        </button>
        <button
          onClick={handleCopyToPO}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy To PO
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////////////////



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

// export default function GrnForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("editId");

//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     if (editId) {
//       axios
//         .get(`/api/grn/${editId}`)
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
//         await axios.put(`/api/grn/${editId}`, formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("Purchase GRN updated successfully");
//         router.push("/admin/grn-view");
//       } catch (error) {
//         console.error("Error updating GRN:", error);
//         alert("Failed to update GRN");
//       }
//     } else {
//       try {
//         await axios.post("/api/grn", formData, {
//           headers: { "Content-Type": "application/json" },
//         });
//         alert("Purchase GRN added successfully");
//         setFormData(initialState);
//         router.push("/admin/grn-view");
//       } catch (error) {
//         console.error("Error adding GRN:", error);
//         alert("Error adding GRN");
//       }
//     }
//   };
//   return (
//     <div className="m-11 p-5 shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit GRN" : "Create GRN"}
//       </h1>
//       {/* Supplier Section */}
//       <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
//         <div className="grid grid-cols-2 gap-7">
//           <div>
//             <label className="block mb-2 font-medium">Supplier Name</label>
//             {formData.supplierName ? (
//               <input
//                 type="text"
//                 name="supplierName"
//                 value={formData.supplierName}
//                 readOnly
//                 className="w-full p-2 border rounded bg-gray-100"
//               />
//             ) : (
//               <SupplierSearch onSelectSupplier={handleSupplierSelect} />
//             )}
            
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

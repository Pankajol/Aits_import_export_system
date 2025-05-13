"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import ItemSection from "@/components/ItemSection";
import CustomerSearch from "@/components/CustomerSearch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Updated initial state for Sales Order with additional item fields.
const initialOrderState = {
  customerCode: "",
  customerName: "",
  contactPerson: "",
  refNumber: "",
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
      receivedQuantity: 0, // For Sales Order copy.
      unitPrice: 0,
      discount: 0,
      freight: 0,
      taxOption: "GST", // or "IGST"
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      gstRate: 0,       // New field for Sales Order copy.
      cgstAmount: 0,    // New field.
      sgstAmount: 0,    // New field.
      igstAmount: 0,
      managedBy: "",    // New field.
      batches: [],
      errorMessage: "",
      warehouse: "",
      warehouseName: "",
      warehouseCode: "",
      warehouseId: "",
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

// Helper function to fetch managedBy from the item master using itemId.
// async function fetchManagedBy(itemId) {
//   try {
//     const res = await axios.get(`/api/items/${itemId}`);
//     return res.data.managedBy; // Returns "batch" or another value.
//   } catch (error) {
//     console.error("Error fetching managedBy for item", itemId, error);
//     return "";
//   }
// }

export default function SalesOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState(initialOrderState);

  // Summary Calculation Effect.
  useEffect(() => {
    const totalBeforeDiscountCalc = formData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 0;
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

    const grandTotalCalc =
      totalItemsCalc + gstTotalCalc + overallFreight + roundingCalc;
    const openBalanceCalc =
      grandTotalCalc - (totalDownPaymentCalc + appliedAmountsCalc);

    if (
      totalBeforeDiscountCalc !== formData.totalBeforeDiscount ||
      gstTotalCalc !== formData.gstTotal ||
      grandTotalCalc !== formData.grandTotal ||
      openBalanceCalc !== formData.openBalance
    ) {
      setFormData((prev) => ({
        ...prev,
        totalBeforeDiscount: totalBeforeDiscountCalc,
        gstTotal: gstTotalCalc,
        grandTotal: grandTotalCalc,
        openBalance: openBalanceCalc,
      }));
    }
  }, [
    formData.items,
    formData.freight,
    formData.rounding,
    formData.totalDownPayment,
    formData.appliedAmounts,
    formData.totalBeforeDiscount,
    formData.gstTotal,
    formData.grandTotal,
    formData.openBalance,
  ]);

  // Copy effect: Load data from sessionStorage (salesOrderData) and for items managed by batch, re-fetch managedBy.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("salesOrderData");
      if (storedData) {
        (async () => {
          try {
            const parsedData = JSON.parse(storedData);
            const updatedItems = await Promise.all(
              parsedData.items.map(async (item) => {
                if (item.managedByBatch && (!item.managedBy || item.managedBy === "batch")) {
                  // Using itemId as the unique identifier.
                  const newManagedBy = await fetchManagedBy(item.itemId);
                  return {
                    ...item,
                    managedBy: newManagedBy || "batch",
                    gstRate: item.gstRate !== undefined ? item.gstRate : 0,
                    cgstAmount: item.cgstAmount !== undefined ? item.cgstAmount : 0,
                    sgstAmount: item.sgstAmount !== undefined ? item.sgstAmount : 0,
                  };
                }
                return {
                  ...item,
                  gstRate: item.gstRate !== undefined ? item.gstRate : 0,
                  cgstAmount: item.cgstAmount !== undefined ? item.cgstAmount : 0,
                  sgstAmount: item.sgstAmount !== undefined ? item.sgstAmount : 0,
                };
              })
            );
            parsedData.items = updatedItems;
            setFormData(parsedData);
            setIsCopied(true);
            sessionStorage.removeItem("salesOrderData");
          } catch (error) {
            console.error("Error parsing copied data:", error);
          }
        })();
      }
    }
  }, []);

  // Edit effect: When editing an existing Sales Order.
  useEffect(() => {
    if (editId) {
      axios
        .get(`/api/salesOrder/${editId}`)
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
          console.error("Error fetching Sales Order for edit", err);
          toast.error("Error fetching Sales Order data");
        });
    }
  }, [editId]);

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
          receivedQuantity: 0,
          unitPrice: 0,
          discount: 0,
          freight: 0,
          taxOption: "GST",
          priceAfterDiscount: 0,
          totalAmount: 0,
          gstAmount: 0,
          gstRate: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          managedBy: "",
          batches: [],
          errorMessage: "",
          warehouse: "",
          warehouseName: "",
          warehouseCode: "",
          warehouseId: "",
          managedByBatch: true,
        },
      ],
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      // Update each item so that it always has a managedBy value ("batch" or "serial")
      const updatedItems = await Promise.all(
        formData.items.map(async (item) => {
          // If managedBy is missing or you want to ensure it is up-to-date, fetch it
          if (!item.managedBy) {
            const managedByValue = await fetchManagedBy(item.itemId);
            // Ensure the value is either "batch" or "serial" (default to "batch" if unknown)
            const finalManagedBy = managedByValue === "serial" ? "serial" : "batch";
            return { ...item, managedBy: finalManagedBy };
          }
          // Alternatively, you could force refresh for every item:
          // const managedByValue = await fetchManagedBy(item.itemId);
          // const finalManagedBy = managedByValue === "serial" ? "serial" : "batch";
          // return { ...item, managedBy: finalManagedBy };
  
          return item;
        })
      );
  
      // Assemble the updated form data with updated items
      const updatedFormData = { ...formData, items: updatedItems };
  
      if (editId) {
        await axios.put(`/api/salesOrder/${editId}`, updatedFormData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Sales Order updated successfully");
      } else {
        await axios.post("/api/sales-order", updatedFormData, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Sales Order added successfully");
        setFormData(initialOrderState);
      }
      router.push("/admin/sales-order-view");
    } catch (error) {
      console.error("Error saving Sales Order:", error);
      toast.error(editId ? "Failed to update Sales Order" : "Error adding Sales Order");
    }
  };
  

  return (
    <div className="m-11 p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">
        {editId ? "Edit Sales Order" : "Create Sales Order"}
      </h1>
      {/* Customer Section */}
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
          <div>
            {isCopied ? (
              <div>
                <label className="block mb-2 font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  className="w-full p-2 border rounded"
                />
              </div>
            ) : (
              <div>
                <label className="block mb-2 font-medium">Customer Name</label>
                <CustomerSearch onSelectCustomer={handleCustomerSelect} />
              </div>
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
            <label className="block mb-2 font-medium">Reference Number</label>
            <input
              type="text"
              name="refNumber"
              value={formData.refNumber || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Additional Order Info */}
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
            <label className="block mb-2 font-medium">Order Date</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Expected Delivery Date
            </label>
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
          <label className="block mb-2 font-medium">Total Before Discount</label>
          <input
            type="number"
            value={formData.totalBeforeDiscount.toFixed(2)}
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
          <label className="block mb-2 font-medium">GST Total</label>
          <input
            type="number"
            value={formData.gstTotal.toFixed(2)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Grand Total</label>
          <input
            type="number"
            value={formData.grandTotal.toFixed(2)}
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
          {editId ? "Update" : "Add"}
        </button>
        <button
          onClick={() => {
            setFormData(initialOrderState);
            router.push("/admin/salesOrder");
          }}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            sessionStorage.setItem("salesOrderData", JSON.stringify(formData));
            alert("Data copied from Sales Order!");
          }}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Copy From
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

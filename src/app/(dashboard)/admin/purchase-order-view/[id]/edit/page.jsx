"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ItemSection from "@/components/ItemSection";
import SupplierSearch from "@/components/SupplierSearch";
import { FaCheckCircle } from "react-icons/fa";

const demoSuggestions = [
  { _id: "demo1", name: "Demo Supplier One", code: "DS1", contactPerson: "Alice" },
  { _id: "demo2", name: "Demo Supplier Two", code: "DS2", contactPerson: "Bob" },
  { _id: "demo3", name: "Demo Supplier Three", code: "DS3", contactPerson: "Charlie" },
];

const initialPurchaseOrderState = {
  supplierCode: "",
  supplierName: "",
  contactPerson: "",
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
    },
  ],
  salesEmployee: "",
  remarks: "",
  freight: 0,
  rounding: 0,
  totalBeforeDiscount: 0,
  totalDownPayment: 0,
  appliedAmounts: 0,
  gstTotal: 0,
  grandTotal: 0,
  openBalance: 0,
};

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  const ddMmYyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddMmYyyyRegex.test(dateStr)) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  return "";
}

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState(initialPurchaseOrderState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await axios.get(`/api/purchase-order/${id}`);
        setOrderData(res.data);
      } catch (err) {
        console.error("Error fetching purchase order:", err);
        setError("Failed to load purchase order");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSupplierSelect = useCallback((selectedSupplier) => {
    setSupplier(selectedSupplier);
    setOrderData((prev) => ({
      ...prev,
      supplierCode: selectedSupplier.supplierCode || "",
      supplierName: selectedSupplier.supplierName || "",
      contactPerson: selectedSupplier.contactPersonName || "",
    }));
  }, []);

  useEffect(() => {
    if (orderData.supplierName) {
      const matchingSupplier = demoSuggestions.find(
        (s) => s.name.toLowerCase() === orderData.supplierName.toLowerCase()
      );
      if (matchingSupplier) {
        setOrderData((prev) => ({
          ...prev,
          supplierCode: matchingSupplier.code,
          contactPerson: matchingSupplier.contactPerson,
        }));
      }
    }
  }, [orderData.supplierName]);

  const handleItemChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setOrderData((prev) => {
      const updatedItems = [...prev.items];
      const numericFields = ["quantity", "unitPrice", "discount", "freight", "gstType", "tdsAmount"];
      const newValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
      updatedItems[index] = { ...updatedItems[index], [name]: newValue };

      const { unitPrice = 0, discount = 0, quantity = 1, freight: itemFreight = 0, gstType = 0 } = updatedItems[index];
      const priceAfterDiscount = unitPrice - discount;
      const totalAmount = quantity * priceAfterDiscount + itemFreight;
      const gstAmount = totalAmount * (gstType / 100);
      updatedItems[index].priceAfterDiscount = priceAfterDiscount;
      updatedItems[index].totalAmount = totalAmount;
      updatedItems[index].gstAmount = gstAmount;
      return { ...prev, items: updatedItems };
    });
  }, []);

  const addItemRow = useCallback(() => {
    setOrderData((prev) => ({
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
        },
      ],
    }));
  }, []);

  const removeItemRow = useCallback((index) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  useEffect(() => {
    const totalBeforeDiscountCalc = orderData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return acc + (unitPrice - discount) * quantity;
    }, 0);
    const totalItemsCalc = orderData.items.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);
    const gstTotalCalc = orderData.items.reduce((acc, item) => acc + (parseFloat(item.gstAmount) || 0), 0);
    const overallFreight = parseFloat(orderData.freight) || 0;
    const roundingCalc = parseFloat(orderData.rounding) || 0;
    const totalDownPaymentCalc = parseFloat(orderData.totalDownPayment) || 0;
    const appliedAmountsCalc = parseFloat(orderData.appliedAmounts) || 0;
    const grandTotalCalc = totalItemsCalc + gstTotalCalc + overallFreight + roundingCalc;
    const openBalanceCalc = grandTotalCalc - (totalDownPaymentCalc + appliedAmountsCalc);
    if (
      totalBeforeDiscountCalc !== orderData.totalBeforeDiscount ||
      gstTotalCalc !== orderData.gstTotal ||
      grandTotalCalc !== orderData.grandTotal ||
      openBalanceCalc !== orderData.openBalance
    ) {
      setOrderData((prev) => ({
        ...prev,
        totalBeforeDiscount: totalBeforeDiscountCalc,
        gstTotal: gstTotalCalc,
        grandTotal: grandTotalCalc,
        openBalance: openBalanceCalc,
      }));
    }
  }, [
    orderData.items,
    orderData.freight,
    orderData.rounding,
    orderData.totalDownPayment,
    orderData.appliedAmounts,
    orderData.totalBeforeDiscount,
    orderData.gstTotal,
    orderData.grandTotal,
    orderData.openBalance,
  ]);

  const handleUpdateOrder = useCallback(async () => {
    try {
      const response = await axios.put(`/api/purchase-order/${id}`, orderData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Purchase Order updated successfully: " + response.data.message);
      router.push("/admin/purchase-order-view");
    } catch (error) {
      console.error("Error updating Purchase Order:", error);
      const errorMsg = error.response?.data?.message || "Error updating Purchase Order";
      alert(errorMsg);
    }
  }, [orderData, id, router]);

  const handleCancel = useCallback(() => {
    router.push("/admin/purchase-order-view");
  }, [router]);

  const handleCopyTo = useCallback(
    (destination) => {
      if (destination === "GRN") {
        sessionStorage.setItem("grnData", JSON.stringify(orderData));
        router.push("/admin/GRN");
      } else if (destination === "PurchaseInvoice") {
        sessionStorage.setItem("purchaseInvoiceData", JSON.stringify(orderData));
        router.push("/admin/purchase-invoice");
      } else if (destination === "DebitNote") {
        sessionStorage.setItem("debitNoteData", JSON.stringify(orderData));
        router.push("/admin/debit-note");
      }
    },
    [orderData, router]
  );

  function CopyToDropdown({ handleCopyTo, defaultLabel }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(defaultLabel);
    const toggleDropdown = () => setOpen((prev) => !prev);
    const onSelect = (option) => {
      setSelected(option);
      setOpen(false);
      handleCopyTo(option);
    };
    const ref = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
      <div ref={ref} className="relative inline-block text-left">
        <button onClick={toggleDropdown} className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300 focus:outline-none shadow">
          {selected}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
            <button onClick={() => onSelect("GRN")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
              GRN
            </button>
            <button onClick={() => onSelect("PurchaseInvoice")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Purchase Invoice
            </button>
            <button onClick={() => onSelect("DebitNote")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Debit Note
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="m-11 p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Purchase Order</h1>
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
          <div>
            <label className="block mb-2 font-medium">Supplier Name</label>
            <input
              type="text"
              name="supplierName"
              value={orderData.supplierName || ""}
              onChange={handleInputChange}
              placeholder="Enter supplier name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Supplier Code</label>
            <input type="text" name="supplierCode" value={orderData.supplierCode || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Contact Person</label>
            <input type="text" name="contactPerson" value={orderData.contactPerson || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Reference Number</label>
            <input type="text" name="refNumber" value={orderData.refNumber || ""} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select name="status" value={orderData.status || ""} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="">Select status (optional)</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Posting Date</label>
            <input type="date" name="postingDate" value={formatDateForInput(orderData.postingDate)} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Valid Until</label>
            <input type="date" name="validUntil" value={formatDateForInput(orderData.validUntil)} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-2 font-medium">Delivery Date</label>
            <input type="date" name="documentDate" value={formatDateForInput(orderData.documentDate)} onChange={handleInputChange} className="w-full p-2 border rounded" />
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-6">Items</h2>
      <div className="flex flex-col m-10 p-5 border rounded-lg shadow-lg">
        <ItemSection items={orderData.items} onItemChange={handleItemChange} onAddItem={addItemRow} onRemoveItem={removeItemRow} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Sales Employee</label>
          <input type="text" name="salesEmployee" value={orderData.salesEmployee || ""} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Remarks</label>
          <textarea name="remarks" value={orderData.remarks || ""} onChange={handleInputChange} className="w-full p-2 border rounded"></textarea>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Taxable Amount</label>
          <input type="number" name="taxableAmount" value={orderData.items.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)} readOnly className="w-full p-2 border rounded bg-gray-100" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Rounding</label>
          <input type="number" name="rounding" value={orderData.rounding || 0} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST</label>
          <input type="number" name="gstTotal" value={orderData.gstTotal || 0} readOnly className="w-full p-2 border rounded bg-gray-100" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Total Amount</label>
          <input type="number" name="grandTotal" value={orderData.grandTotal || 0} readOnly className="w-full p-2 border rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <button onClick={handleUpdateOrder} className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300">
          Update
        </button>
        <button onClick={handleCancel} className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300">
          Cancel
        </button>
      </div>
      {isCopied && (
        <div className="flex items-center space-x-2 text-green-600">
          <FaCheckCircle />
          <span>Purchase Order data loaded from copy.</span>
        </div>
      )}
    </div>
  );
}

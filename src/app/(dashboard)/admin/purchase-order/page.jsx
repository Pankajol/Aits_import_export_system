"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ItemSection from "@/components/ItemSection";
import SupplierSearch from "@/components/SupplierSearch";
import { FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Demo supplier suggestions.
const demoSuggestions = [
  { _id: "demo1", name: "Demo Supplier One", code: "DS1", contactPerson: "Alice" },
  { _id: "demo2", name: "Demo Supplier Two", code: "DS2", contactPerson: "Bob" },
  { _id: "demo3", name: "Demo Supplier Three", code: "DS3", contactPerson: "Charlie" },
];

// Updated initial state using new fields.
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
      orderedQuantity: 0,
      unitPrice: 0,
      discount: 0,
      freight: 0,
      gstRate: 0,            // new field (instead of gstType)
      taxOption: "GST",      // "GST" or "IGST"
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      warehouse: "",
      warehouseName: "",
      warehouseCode: "",
      stockAdded: false,
      // IMPORTANT: The managedBy field is now preserved from the item master.
      managedBy: "",
      batches: [],
      qualityCheckDetails: [],
      removalReason: "",
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
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return "";
}

export default function PurchaseOrderForm() {
  const [orderData, setOrderData] = useState(initialPurchaseOrderState);
  const [isCopied, setIsCopied] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const router = useRouter();
  const parentRef = useRef(null);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Handler to update a specific item's warehouse fields.
  const handleWarehouseSelect = (warehouse) => {
    if (selectedItemIndex !== null) {
      setOrderData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[selectedItemIndex].warehouse = warehouse._id;
        updatedItems[selectedItemIndex].warehouseName = warehouse.warehouseName;
        updatedItems[selectedItemIndex].warehouseCode = warehouse.warehouseCode;
        return { ...prev, items: updatedItems };
      });
    }
    setWarehouseModalOpen(false);
    setSelectedItemIndex(null);
  };

  // Auto-fill PO data from sessionStorage if available.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("purchaseOrderData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setOrderData(parsedData);
          setIsCopied(true);
          sessionStorage.removeItem("purchaseOrderData");
        } catch (error) {
          console.error("Error parsing purchaseOrderData:", error);
          toast.error("Error loading saved Purchase Order data.");
        }
      }
    }
  }, []);

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

  // Update item fields using gstRate and taxOption.
  const handleItemChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setOrderData((prev) => {
      const updatedItems = [...prev.items];
      const numericFields = ["quantity", "unitPrice", "discount", "freight", "gstRate", "tdsAmount"];
      const newValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
      updatedItems[index] = { ...updatedItems[index], [name]: newValue };

      // Recalculate derived values.
      const { unitPrice = 0, discount = 0, quantity = 1, freight: itemFreight = 0, gstRate = 0, taxOption = "GST" } = updatedItems[index];
      const priceAfterDiscount = unitPrice - discount;
      const totalAmount = quantity * priceAfterDiscount + itemFreight;
      updatedItems[index].priceAfterDiscount = priceAfterDiscount;
      updatedItems[index].totalAmount = totalAmount;
      if (taxOption === "IGST") {
        updatedItems[index].igstAmount = totalAmount * (gstRate / 100);
        updatedItems[index].gstAmount = 0;
        updatedItems[index].cgstAmount = 0;
        updatedItems[index].sgstAmount = 0;
      } else {
        updatedItems[index].cgstAmount = totalAmount * ((gstRate / 2) / 100);
        updatedItems[index].sgstAmount = totalAmount * ((gstRate / 2) / 100);
        updatedItems[index].gstAmount = updatedItems[index].cgstAmount + updatedItems[index].sgstAmount;
        updatedItems[index].igstAmount = 0;
      }
      return { ...prev, items: updatedItems };
    });
  }, []);

  // When an item is selected (via search or barcode scan).
  const handleItemSelect = useCallback((index, selectedItem) => {
    console.log("Parent received selected item:", selectedItem);
    setOrderData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        item: selectedItem._id,
        itemCode: selectedItem.itemCode || "",
        itemName: selectedItem.itemName,
        itemDescription: selectedItem.description || "",
        unitPrice: selectedItem.unitPrice || 0,
        discount: selectedItem.discount || 0,
        freight: selectedItem.freight || 0,
        // Map gstType from PO to gstRate for GRN.
        gstRate: selectedItem.gstType || 0,
        taxOption: "GST", // Default to GST; adjust if your item specifies IGST.
        quantity: 1,
        priceAfterDiscount: (selectedItem.unitPrice || 0) - (selectedItem.discount || 0),
        totalAmount:
          1 * ((selectedItem.unitPrice || 0) - (selectedItem.discount || 0)) +
          (selectedItem.freight || 0),
        // Calculate tax amounts.
        ...(selectedItem.gstType || 0) && {
          cgstAmount: ((selectedItem.unitPrice || 0) - (selectedItem.discount || 0) + (selectedItem.freight || 0)) * ((selectedItem.gstType || 0) / 2 / 100),
          sgstAmount: ((selectedItem.unitPrice || 0) - (selectedItem.discount || 0) + (selectedItem.freight || 0)) * ((selectedItem.gstType || 0) / 2 / 100),
          gstAmount: (((selectedItem.unitPrice || 0) - (selectedItem.discount || 0) + (selectedItem.freight || 0)) * ((selectedItem.gstType || 0) / 2 / 100)) * 2,
        },
        igstAmount: 0,
        // Preserve the managedBy value from the item master.
        managedBy: selectedItem.managedBy,
        // Only set up batches if the item is batch-managed.
        batches:
          selectedItem.managedBy && selectedItem.managedBy.toLowerCase() === "batch"
            ? []
            : [],
        qualityCheckDetails:
          selectedItem.qualityCheckDetails && selectedItem.qualityCheckDetails.length > 0
            ? selectedItem.qualityCheckDetails
            : [
                { parameter: "Weight", min: "", max: "", actualValue: "" },
                { parameter: "Dimension", min: "", max: "", actualValue: "" },
              ],
        removalReason: "",
      };
      return { ...prev, items: newItems };
    });
  }, []);

  // Reuse addItemRow (defined earlier) for both PO and GRN copy.
  const addItemRowHandler = useCallback(() => {
    setOrderData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemCode: "",
          itemName: "",
          itemDescription: "",
          quantity: 0,
          orderedQuantity: 0,
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
          tdsAmount: 0,
          warehouse: "",
          warehouseName: "",
          warehouseCode: "",
          stockAdded: false,
          // Do not force a default here—preserve from item master.
          managedBy: "",
          batches: [],
          qualityCheckDetails: [
            { parameter: "Weight", min: "", max: "", actualValue: "" },
            { parameter: "Dimension", min: "", max: "", actualValue: "" },
          ],
          removalReason: "",
        },
      ],
    }));
  }, []);

  // Summary Calculation.
  useEffect(() => {
    const totalBeforeDiscountCalc = orderData.items.reduce((acc, item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const discount = parseFloat(item.discount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      return acc + (unitPrice - discount) * quantity;
    }, 0);
    const totalItemsCalc = orderData.items.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0);
    const gstTotalCalc = orderData.items.reduce((acc, item) => {
      if (item.taxOption === "IGST") {
        return acc + (parseFloat(item.igstAmount) || 0);
      }
      return acc + (parseFloat(item.gstAmount) || 0);
    }, 0);
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

  const handleCreatePurchaseOrder = async (poData) => {
    try {
      const response = await axios.post("/api/purchase-order", poData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Purchase order created successfully!");
      setOrderData(initialPurchaseOrderState);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error(error.response?.data?.message || "Error creating purchase order");
    }
  };

  // "Copy From" handler: Map PO data to include GRN-required fields.
  // IMPORTANT: Do not force default managedBy here; preserve the item master value.
  const handleCopyFrom = useCallback(() => {
    const modifiedData = {
      ...orderData,
      items: orderData.items.map((item) => ({
        ...item,
        managedBy: item.managedBy, // Preserve as is from the item master.
        batches:
          item.managedBy && item.managedBy.toLowerCase() === "batch"
            ? item.batches || []
            : [],
        // Map gstType to gstRate for GRN.
        gstRate: item.gstType,
        taxOption: "GST",
        qualityCheckDetails:
          item.qualityCheckDetails && item.qualityCheckDetails.length > 0
            ? item.qualityCheckDetails
            : [
                { parameter: "Weight", min: "", max: "", actualValue: "" },
                { parameter: "Dimension", min: "", max: "", actualValue: "" },
              ],
      })),
    };
    sessionStorage.setItem("purchaseOrderData", JSON.stringify(modifiedData));
    toast.success("Data copied from Purchase Order!");
  }, [orderData]);

  // "Copy To" action.
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

  // Dropdown component for "Copy To".
  const CopyToDropdown = ({ handleCopyTo, defaultLabel }) => {
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
  };
  CopyToDropdown.defaultProps = {
    handleCopyTo: () => {},
    defaultLabel: "Copy To",
  };

  // Open warehouse modal for a specific item.
  const handleSelectWarehouseForItem = useCallback((index) => {
    setSelectedItemIndex(index);
    setWarehouseModalOpen(true);
  }, []);

  return (
    <div ref={parentRef} className="m-11 p-5 shadow-xl">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Purchase Order Form</h1>
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="grid grid-cols-2 gap-7">
          {isCopied ? (
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
          ) : (
            <div>
              <label className="block mb-2 font-medium">Supplier Name</label>
              <SupplierSearch onSelectSupplier={handleSupplierSelect} />
            </div>
          )}
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
        <ItemSection
          items={orderData.items}
          onItemChange={handleItemChange}
          onItemSelect={handleItemSelect}
          onWarehouseSelect={(index) => handleSelectWarehouseForItem(index)}
          onAddItem={(!isCopied) ? addItemRowHandler : undefined}
        />
      </div>
      {/* Warehouse Modal would be rendered here if implemented */}
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
          <input
            type="number"
            name="taxableAmount"
            value={orderData.items.reduce((acc, item) => acc + (parseFloat(item.totalAmount) || 0), 0)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Rounding</label>
          <input type="number" name="rounding" value={orderData.rounding || 0} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST Total</label>
          <input
            type="number"
            name="gstTotal"
            value={orderData.items.reduce((acc, item) => {
              if (item.taxOption === "IGST") {
                return acc + (parseFloat(item.igstAmount) || 0);
              }
              return acc + (parseFloat(item.gstAmount) || 0);
            }, 0)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Total Amount</label>
          <input type="number" name="grandTotal" value={orderData.grandTotal || 0} readOnly className="w-full p-2 border rounded bg-gray-100" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <button
          onClick={() => handleCreatePurchaseOrder(orderData)}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Add
        </button>
        <button className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300">
          Cancel
        </button>
        <button
          onClick={handleCopyFrom}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Copy From
        </button>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center">
            <CopyToDropdown
              handleCopyTo={handleCopyTo}
              defaultLabel={supplier ? `Copy To (${supplier.supplierName})` : "Copy To"}
            />
          </div>
        </div>
      </div>
      {isCopied && (
        <div className="flex items-center space-x-2 text-green-600">
          <FaCheckCircle />
          <span>Purchase Order data loaded from copy.</span>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}




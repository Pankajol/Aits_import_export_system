"use client";
import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import WarehouseSelectorModal from "./WarehouseSelector";
import ItemGroupSearch from "./ItemGroupSearch";

function ItemManagement({ itemId }) {
  const router = useRouter();
  const [itemList, setItemList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [itemDetails, setItemDetails] = useState({
    itemCode: "",
    itemName: "",
    description: "",
    category: "",
    unitPrice: "",
    quantity: "",
    reorderLevel: "",
    itemType: "",
    uom: "",
    managedBy: "",
    managedValue: "",
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    gnr: false,
    delivery: false,
    productionProcess: false,
    // For quality check, now using a checkbox toggle
    includeQualityCheck: false,
    qualityCheckDetails: [],
    // Tax details flags and fields:
    includeGST: true,
    includeIGST: false,
    // GST details:
    gstCode: "",
    gstName: "",
    gstRate: "",
    cgstRate: "",
    sgstRate: "",
    // IGST details:
    igstCode: "",
    igstName: "",
    igstRate: "",
    status: "",
    active: true,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle change for all fields.
  const handleItemDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setItemDetails((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    if (name === "gstRate") {
      const rate = parseFloat(value) || 0;
      const halfRate = rate / 2;
      setItemDetails((prev) => ({
        ...prev,
        gstRate: value,
        cgstRate: halfRate,
        sgstRate: halfRate,
      }));
    } else {
      setItemDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Quality Check detail handler.
  const handleQualityCheckDetailChange = (index, e) => {
    const { name, value } = e.target;
    setItemDetails((prev) => {
      const newQC = [...prev.qualityCheckDetails];
      newQC[index] = { ...newQC[index], [name]: value };
      return { ...prev, qualityCheckDetails: newQC };
    });
  };

  const addQualityCheckItem = () => {
    setItemDetails((prev) => ({
      ...prev,
      qualityCheckDetails: [
        ...prev.qualityCheckDetails,
        { srNo: "", parameter: "", min: "", max: "" },
      ],
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setItemDetails((prev) => ({ ...prev, category: category.name }));
  };

  // Fetch master items list.
  const fetchItemDetailsList = async () => {
    try {
      const res = await axios.get("/api/items");
      setItemList(res.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItemDetailsList();
  }, []);

  useEffect(() => {
    if (itemId) {
      const fetchItemDetails = async () => {
        try {
          const response = await axios.get(`/api/items/${itemId}`);
          setItemDetails(response.data);
          setIsEditing(true);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };
      fetchItemDetails();
    } else {
      generateItemCode();
    }
  }, [itemId]);

  const generateItemCode = async () => {
    try {
      const lastCodeRes = await fetch("/api/lastItemCode");
      const { lastItemCode } = await lastCodeRes.json();
      const lastNumber = parseInt(lastItemCode.split("-")[1], 10) || 0;
      let newNumber = lastNumber + 1;
      let generatedCode = "";
      while (true) {
        generatedCode = `ITEM-${newNumber.toString().padStart(4, "0")}`;
        const checkRes = await axios.get(`/api/checkItemCode?code=${generatedCode}`);
        const { exists } = checkRes.data;
        if (!exists) break;
        newNumber++;
      }
      setItemDetails((prev) => ({ ...prev, itemCode: generatedCode }));
    } catch (error) {
      console.error("Failed to generate code:", error);
    }
  };

  const handleEdit = (item) => {
    setItemDetails(item);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/items/${itemDetails._id}`, itemDetails);
        alert("Item updated successfully!");
      } else {
        await axios.post("/api/items", itemDetails);
        alert("Item created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.error || "Form submission error");
    }
  };

  const resetForm = () => {
    setItemDetails({
      itemCode: "",
      itemName: "",
      description: "",
      category: "",
      unitPrice: "",
      quantity: "",
      reorderLevel: "",
      itemType: "",
      uom: "",
      managedBy: "",
      managedValue: "",
      batchNumber: "",
      expiryDate: "",
      manufacturer: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      gnr: false,
      delivery: false,
      productionProcess: false,
      includeQualityCheck: false,
      qualityCheckDetails: [],
      includeGST: true,
      includeIGST: false,
      gstCode: "",
      gstName: "",
      gstRate: "",
      cgstRate: "",
      sgstRate: "",
      igstCode: "",
      igstName: "",
      igstRate: "",
      status: "",
      active: true,
    });
    setIsEditing(false);
  };

  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = itemList.filter((item) =>
      item.itemCode.toLowerCase().includes(term) ||
      item.itemName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  }, [searchTerm, itemList]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        {isEditing ? "Edit Item" : "Create Item"}
      </h1>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Basic Item Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Item Code</label>
            <input
              type="text"
              value={itemDetails.itemCode}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="itemName"
              value={itemDetails.itemName}
              onChange={handleItemDetailsChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <ItemGroupSearch onSelectItemGroup={handleCategorySelect} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Unit Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unitPrice"
              value={itemDetails.unitPrice}
              onChange={handleItemDetailsChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={itemDetails.quantity}
              onChange={handleItemDetailsChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={itemDetails.reorderLevel}
              onChange={handleItemDetailsChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={itemDetails.description}
              onChange={handleItemDetailsChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24"
            />
          </div>
        </div>

        {/* Tax Details Checkboxes */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="includeGST"
              checked={itemDetails.includeGST}
              onChange={handleItemDetailsChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Include GST</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="includeIGST"
              checked={itemDetails.includeIGST}
              onChange={handleItemDetailsChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Include IGST</label>
          </div>
        </div>

        {/* GST Details Section */}
        {itemDetails.includeGST && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">GST Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">GST Code</label>
                <input
                  type="text"
                  name="gstCode"
                  value={itemDetails.gstCode}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">GST Name</label>
                <input
                  type="text"
                  name="gstName"
                  value={itemDetails.gstName}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                <input
                  type="number"
                  name="gstRate"
                  value={itemDetails.gstRate}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">CGST Rate (%)</label>
                <input
                  type="number"
                  name="cgstRate"
                  value={itemDetails.cgstRate}
                  readOnly
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">SGST Rate (%)</label>
                <input
                  type="number"
                  name="sgstRate"
                  value={itemDetails.sgstRate}
                  readOnly
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* IGST Details Section */}
        {itemDetails.includeIGST && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">IGST Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">IGST Code</label>
                <input
                  type="text"
                  name="igstCode"
                  value={itemDetails.igstCode}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">IGST Name</label>
                <input
                  type="text"
                  name="igstName"
                  value={itemDetails.igstName}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">IGST Rate (%)</label>
                <input
                  type="number"
                  name="igstRate"
                  value={itemDetails.igstRate}
                  onChange={handleItemDetailsChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quality Check Section */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="includeQualityCheck"
              checked={itemDetails.includeQualityCheck}
              onChange={handleItemDetailsChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Include Quality Check</label>
          </div>
        </div>
        {itemDetails.includeQualityCheck && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Quality Check Details</h3>
            {itemDetails.qualityCheckDetails.map((qcItem, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  name="srNo"
                  placeholder="Sr No"
                  value={qcItem.srNo}
                  onChange={(e) => handleQualityCheckDetailChange(index, e)}
                  className="border p-1 rounded w-1/4"
                />
                <input
                  type="text"
                  name="parameter"
                  placeholder="Parameter"
                  value={qcItem.parameter}
                  onChange={(e) => handleQualityCheckDetailChange(index, e)}
                  className="border p-1 rounded w-1/4"
                />
                <input
                  type="text"
                  name="min"
                  placeholder="Min"
                  value={qcItem.min}
                  onChange={(e) => handleQualityCheckDetailChange(index, e)}
                  className="border p-1 rounded w-1/4"
                />
                <input
                  type="text"
                  name="max"
                  placeholder="Max"
                  value={qcItem.max}
                  onChange={(e) => handleQualityCheckDetailChange(index, e)}
                  className="border p-1 rounded w-1/4"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addQualityCheckItem}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Quality Check Item
            </button>
          </div>
        )}

        {/* Unit, Item Type, and Managed By */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
            <select
              name="uom"
              value={itemDetails.uom}
              onChange={handleItemDetailsChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="">Select UOM</option>
              <option value="KG">KG</option>
              <option value="MTP">MTP</option>
              <option value="PC">PC</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Item Type</label>
            <select
              name="itemType"
              value={itemDetails.itemType}
              onChange={handleItemDetailsChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="">Select Item Type</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Managed By</label>
            <select
              name="managedBy"
              value={itemDetails.managedBy}
              onChange={(e) =>
                setItemDetails({
                  ...itemDetails,
                  managedBy: e.target.value,
                  batchNumber: "",
                  expiryDate: "",
                  manufacturer: "",
                  managedValue: "",
                })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="">Select</option>
              <option value="batch">Batch</option>
              <option value="serial">Serial</option>
            </select>
          </div>
        </div>

        {/* Status and Dimensions/Weight */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={itemDetails.status}
              onChange={handleItemDetailsChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Length</label>
              <input
                type="number"
                name="length"
                value={itemDetails.length}
                onChange={handleItemDetailsChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Width</label>
              <input
                type="number"
                name="width"
                value={itemDetails.width}
                onChange={handleItemDetailsChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="number"
                name="height"
                value={itemDetails.height}
                onChange={handleItemDetailsChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="number"
                name="weight"
                value={itemDetails.weight}
                onChange={handleItemDetailsChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit / Cancel Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className={`px-6 py-3 text-white font-bold rounded-lg ${isEditing ? "bg-blue-600" : "bg-green-600"}`}
          >
            {isEditing ? "Update Item" : "Create Item"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white rounded-lg px-6 py-3 font-bold"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Item List */}
      <h2 className="text-2xl font-bold text-blue-600 mt-12">Item List</h2>
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Search items..."
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Item Code</th>
              <th className="p-2 border">Item Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-2 border">{item.itemCode}</td>
                <td className="p-2 border">{item.itemName}</td>
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">${item.unitPrice}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemManagement;






// here not including gst
// "use client";
// import React, { useState, useEffect } from "react"; 
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// import WarehouseSelectorModal from "./WarehouseSelector";
// import ItemGroupSearch from "./ItemGroupSearch";

// function ItemManagement({ itemId }) {
//   const router = useRouter();
//   const [itemList, setItemList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showQualityCheckForm, setShowQualityCheckForm] = useState(false);

//   const [itemDetails, setItemDetails] = useState({
//     itemCode: "",
//     itemName: "",
//     description: "",
//     category: "",
//     unitPrice: "",
//     quantity: "",
//     reorderLevel: "",
//     itemType: "",
//     uom: "",
//     managedBy: "", // if "batch", then show batch details
//     managedValue: "",
//     batchNumber: "",
//     expiryDate: "",
//     manufacturer: "",
//     length: "",
//     width: "",
//     height: "",
//     weight: "",
//     gnr: false,
//     delivery: false,
//     productionProcess: false,
//     qualityCheck: false,
//     qualityCheckDetails: [{ srNo: "", parameter: "", min: "", max: "" }],
//     taxRate: "",
//     status: "",
//     active: true,
//   });

//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // Handler for changes in item details.
//   const handleItemDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setItemDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handler for quality check detail changes.
//   const handleQualityCheckDetailChange = (index, e) => {
//     const { name, value } = e.target;
//     setItemDetails((prev) => {
//       const newQC = [...prev.qualityCheckDetails];
//       newQC[index] = { ...newQC[index], [name]: value };
//       return { ...prev, qualityCheckDetails: newQC };
//     });
//   };

//   const addQualityCheckItem = () => {
//     setItemDetails((prev) => ({
//       ...prev,
//       qualityCheckDetails: [
//         ...prev.qualityCheckDetails,
//         { srNo: "", parameter: "", min: "", max: "" },
//       ],
//     }));
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     setItemDetails((prev) => ({ ...prev, category: category.name }));
//   };

//   // Fetch master items list
//   const fetchItemDetailsList = async () => {
//     try {
//       const res = await axios.get("/api/items");
//       setItemList(res.data || []);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchItemDetailsList();
//   }, []);

//   useEffect(() => {
//     if (itemId) {
//       const fetchItemDetails = async () => {
//         try {
//           const response = await axios.get(`/api/items/${itemId}`);
//           setItemDetails(response.data);
//           setIsEditing(true);
//         } catch (error) {
//           console.error("Error fetching item details:", error);
//         }
//       };
//       fetchItemDetails();
//     } else {
//       generateItemCode();
//     }
//   }, [itemId]);

//   const generateItemCode = async () => {
//     try {
//       const lastCodeRes = await fetch("/api/lastItemCode");
//       const { lastItemCode } = await lastCodeRes.json();
//       const lastNumber = parseInt(lastItemCode.split("-")[1], 10) || 0;
//       let newNumber = lastNumber + 1;
//       let generatedCode = "";
//       let codeExists = true;
//       while (codeExists) {
//         generatedCode = `ITEM-${newNumber.toString().padStart(4, "0")}`;
//         const checkRes = await axios.get(`/api/checkItemCode?code=${generatedCode}`);
//         const { exists } = checkRes.data;
//         if (!exists) break;
//         newNumber++;
//       }
//       setItemDetails((prev) => ({ ...prev, itemCode: generatedCode }));
//     } catch (error) {
//       console.error("Failed to generate code:", error);
//     }
//   };

//   const handleEdit = (item) => {
//     setItemDetails(item);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/items/${id}`);
//       alert("Item deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       alert("Failed to delete item");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         const res = await axios.put(`/api/items/${itemDetails._id}`, itemDetails);
//         alert("Item updated successfully!");
//       } else {
//         const res = await axios.post("/api/items", itemDetails);
//         alert("Item created successfully!");
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert(error.response?.data?.error || "Form submission error");
//     }
//   };

//   const resetForm = () => {
//     setItemDetails({
//       itemCode: "",
//       itemName: "",
//       description: "",
//       category: "",
//       unitPrice: "",
//       quantity: "",
//       reorderLevel: "",
//       itemType: "",
//       uom: "",
//       managedBy: "",
//       managedValue: "",
//       batchNumber: "",
//       expiryDate: "",
//       manufacturer: "",
//       length: "",
//       width: "",
//       height: "",
//       weight: "",
//       gnr: false,
//       delivery: false,
//       productionProcess: false,
//       qualityCheck: false,
//       qualityCheckDetails: [],
//       taxRate: "",
//       status: "",
//       active: true,
//     });
//     setIsEditing(false);
//   };

//   const [filteredItems, setFilteredItems] = useState([]);
//   useEffect(() => {
//     const term = searchTerm.toLowerCase();
//     const filtered = itemList.filter((item) =>
//       item.itemCode.toLowerCase().includes(term) ||
//       item.itemName.toLowerCase().includes(term) ||
//       item.category.toLowerCase().includes(term)
//     );
//     setFilteredItems(filtered);
//   }, [searchTerm, itemList]);

//   return (
//     <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//         {isEditing ? "Edit Item" : "Create Item"}
//       </h1>
      
//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Code
//             </label>
//             <input
//               type="text"
//               value={itemDetails.itemCode}
//               readOnly
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="itemName"
//               value={itemDetails.itemName}
//               onChange={handleItemDetailsChange}
//               required
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Category <span className="text-red-500">*</span>
//             </label>
//             <ItemGroupSearch onSelectItemGroup={handleCategorySelect} />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Unit Price <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="unitPrice"
//               value={itemDetails.unitPrice}
//               onChange={handleItemDetailsChange}
//               required
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Quantity <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={itemDetails.quantity}
//               onChange={handleItemDetailsChange}
//               required
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Reorder Level
//             </label>
//             <input
//               type="number"
//               name="reorderLevel"
//               value={itemDetails.reorderLevel}
//               onChange={handleItemDetailsChange}
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={itemDetails.description}
//               onChange={handleItemDetailsChange}
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24"
//             />
//           </div>

  {/* New Tax Type Selector */}
//   <div>
//   <label className="text-sm font-medium text-gray-700 mb-2">
//     Tax Type
//   </label>
//   <select
//     name="taxType"
//     value={itemDetails.taxType}
//     onChange={handleItemDetailsChange}
//     className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//   >
//     <option value="gst">GST</option>
//     <option value="igst">IGST</option>
//   </select>
// </div>

// {/* Additional space for layout */}
// </div>

// {/* Render GST Details if selected */}
// {itemDetails.taxType === "gst" && (
// <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//   <h3 className="text-lg font-semibold mb-4">GST Details</h3>
//   <div className="grid grid-cols-2 gap-4">
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         GST Code
//       </label>
//       <input
//         type="text"
//         name="gstCode"
//         value={itemDetails.gstCode}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         GST Name
//       </label>
//       <input
//         type="text"
//         name="gstName"
//         value={itemDetails.gstName}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         GST Rate (%)
//       </label>
//       <input
//         type="number"
//         name="gstRate"
//         value={itemDetails.gstRate}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         CGST Rate (%)
//       </label>
//       <input
//         type="number"
//         name="cgstRate"
//         value={itemDetails.cgstRate}
//         readOnly
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         SGST Rate (%)
//       </label>
//       <input
//         type="number"
//         name="sgstRate"
//         value={itemDetails.sgstRate}
//         readOnly
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
//       />
//     </div>
//   </div>
// </div>
// )}

// {/* Render IGST Details if selected */}
// {itemDetails.taxType === "igst" && (
// <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//   <h3 className="text-lg font-semibold mb-4">IGST Details</h3>
//   <div className="grid grid-cols-2 gap-4">
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         IGST Code
//       </label>
//       <input
//         type="text"
//         name="igstCode"
//         value={itemDetails.igstCode}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         IGST Name
//       </label>
//       <input
//         type="text"
//         name="igstName"
//         value={itemDetails.igstName}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//     <div>
//       <label className="text-sm font-medium text-gray-700 mb-2">
//         IGST Rate (%)
//       </label>
//       <input
//         type="number"
//         name="igstRate"
//         value={itemDetails.igstRate}
//         onChange={handleItemDetailsChange}
//         className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//       />
//     </div>
//   </div>
// </div>
// )}

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Unit of Measurement
//             </label>
//             <select
//               name="uom"
//               value={itemDetails.uom}
//               onChange={handleItemDetailsChange}
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value="">Select UOM</option>
//               <option value="KG">KG</option>
//               <option value="MTP">MTP</option>
//               <option value="PC">PC</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Type
//             </label>
//             <select
//               name="itemType"
//               value={itemDetails.itemType}
//               onChange={handleItemDetailsChange}
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value="">Select Item Type</option>
//               <option value="Product">Product</option>
//               <option value="Service">Service</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Managed By
//             </label>
//             <select
//               name="managedBy"
//               value={itemDetails.managedBy}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   managedBy: e.target.value,
//                   // Reset batch details when changing type.
//                   batchNumber: "",
//                   expiryDate: "",
//                   manufacturer: "",
//                   managedValue: "",
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value="">Select</option>
//               <option value="batch">Batch</option>
//               <option value="serial">Serial</option>
//             </select>
//           </div>

//           {/* New Status Field */}
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               name="status"
//               value={itemDetails.status}
//               onChange={handleItemDetailsChange}
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value="">Select status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           {/* New Dimensions & Weight Section */}
//           <div className="md:col-span-2 grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Length
//               </label>
//               <input
//                 type="number"
//                 name="length"
//                 value={itemDetails.length}
//                 onChange={handleItemDetailsChange}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Width
//               </label>
//               <input
//                 type="number"
//                 name="width"
//                 value={itemDetails.width}
//                 onChange={handleItemDetailsChange}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Height
//               </label>
//               <input
//                 type="number"
//                 name="height"
//                 value={itemDetails.height}
//                 onChange={handleItemDetailsChange}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Weight
//               </label>
//               <input
//                 type="number"
//                 name="weight"
//                 value={itemDetails.weight}
//                 onChange={handleItemDetailsChange}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Toggle Quality Check Section */}
//         <div className="mt-4">
//           <button
//             type="button"
//             onClick={() => setShowQualityCheckForm(!showQualityCheckForm)}
//             className="ml-3 bg-slate-500 text-white rounded p-2 hover:bg-slate-600 shadow"
//           >
//             {showQualityCheckForm ? "Hide Quality Check" : "Show Quality Check"}
//           </button>
//         </div>

//         {/* Quality Check Form */}
//         {showQualityCheckForm && (
//           <div className="mt-4 p-4 border rounded-lg bg-gray-100">
//             <h3 className="text-lg font-semibold mb-4">Quality Check Form</h3>
//             {itemDetails.qualityCheckDetails.map((qcItem, index) => (
//               <div key={index} className="flex space-x-2 mb-2">
//                 <input
//                   type="text"
//                   name="srNo"
//                   placeholder="Sr No"
//                   value={qcItem.srNo}
//                   onChange={(e) => handleQualityCheckDetailChange(index, e)}
//                   className="border p-1 rounded w-1/4"
//                 />
//                 <input
//                   type="text"
//                   name="parameter"
//                   placeholder="Parameter"
//                   value={qcItem.parameter}
//                   onChange={(e) => handleQualityCheckDetailChange(index, e)}
//                   className="border p-1 rounded w-1/4"
//                 />
//                 <input
//                   type="text"
//                   name="min"
//                   placeholder="Min"
//                   value={qcItem.min}
//                   onChange={(e) => handleQualityCheckDetailChange(index, e)}
//                   className="border p-1 rounded w-1/4"
//                 />
//                 <input
//                   type="text"
//                   name="max"
//                   placeholder="Max"
//                   value={qcItem.max}
//                   onChange={(e) => handleQualityCheckDetailChange(index, e)}
//                   className="border p-1 rounded w-1/4"
//                 />
//               </div>
//             ))}
//             <div className="mt-2">
//               <button
//                 type="button"
//                 onClick={addQualityCheckItem}
//                 className="bg-blue-500 text-white px-3 py-1 rounded"
//               >
//                 Add Quality Check Item
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowQualityCheckForm(false)}
//                 className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Separate Batch Managed Section (only if "Managed By" is "batch") */}
//         {itemDetails.managedBy === "batch" && (
//           <div className="mt-6 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold mb-4">Batch Details</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Batch Number</label>
//                 <input
//                   type="text"
//                   name="batchNumber"
//                   value={itemDetails.batchNumber}
//                   onChange={handleItemDetailsChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Expiry Date</label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   value={itemDetails.expiryDate}
//                   onChange={handleItemDetailsChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Manufacturer</label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   value={itemDetails.manufacturer}
//                   onChange={handleItemDetailsChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700">Batch Quantity</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={itemDetails.quantity}
//                   onChange={handleItemDetailsChange}
//                   className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3 mt-8">
//           <button
//             type="submit"
//             className={`px-6 py-3 text-white font-bold rounded-lg ${isEditing ? "bg-blue-600" : "bg-green-600"}`}
//           >
//             {isEditing ? "Update Item" : "Create Item"}
//           </button>
//           <button
//             type="button"
//             onClick={resetForm}
//             className="bg-gray-600 text-white rounded-lg px-6 py-3 font-bold"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>

//       <h2 className="text-2xl font-bold text-blue-600 mt-12">Item List</h2>
//       <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
//         <input
//           type="text"
//           placeholder="Search items..."
//           className="mb-4 p-2 border border-gray-300 rounded w-full"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <table className="table-auto w-full border border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Item Code</th>
//               <th className="p-2 border">Item Name</th>
//               <th className="p-2 border">Category</th>
//               <th className="p-2 border">Price</th>
//               <th className="p-2 border">Stock</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map((item) => (
//               <tr key={item._id} className="hover:bg-gray-50">
//                 <td className="p-2 border">{item.itemCode}</td>
//                 <td className="p-2 border">{item.itemName}</td>
//                 <td className="p-2 border">{item.category}</td>
//                 <td className="p-2 border">${item.unitPrice}</td>
//                 <td className="p-2 border">{item.quantity}</td>
//                 <td className="p-2 border flex gap-2">
//                   <button onClick={() => handleEdit(item)} className="text-blue-500">
//                     <FaEdit />
//                   </button>
//                   <button onClick={() => handleDelete(item._id)} className="text-red-500">
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ItemManagement;



/////////////////////////////////////////
// 11/03/2025 fixed 

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// // import CategorySearch from "@/components/CategorySearch";
// import WarehouseSelectorModal from "./WarehouseSelector";
// import ItemGroupSearch from "./ItemGroupSearch";

// function ItemManagement({ itemId, itemCode }) {
//   const router = useRouter();
//   const [itemList, setItemList] = useState([]);
//   const [items, setItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showQualityCheckForm, setShowQualityCheckForm] = useState(false);
//   // const [editingItem, setEditingItem] = useState(null);

//   const filteredItems = itemList.filter(
//     (item) =>
//       item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const goToInventory = () => {
//     router.push("/admin/InventoryView");
//   };
//   const [itemDetails, setItemDetails] = useState({
//     itemCode: "",
//     itemName: "",
//     description: "",
//     category: "",
//     unitPrice: "",
//     quantity: "",
//     reorderLevel: "",
//     itemType: "",
//     uom: "",
//     managedBy: "",
//     managedValue: "",
//     length: "",
//     width: "",
//     height: "",
//     weight: "",
//     gnr: false,
//     delivery: false,
//     productionProcess: false,
//     qualityCheck: false,
//     qualityCheckDetails: [{ srNo: "", parameter: "", min: "", max: "" }],
//     taxRate: "",
//     status: "active",
//     active: true,
//   });

//   const [isEditing, setIsEditing] = useState(false);

//   // Fetch items from the database
//   const fetchItemDetailsList = async () => {
//     try {
//       const res = await axios.get("/api/items");
//       setItems(res.data);
//       // setFilteredItems(res.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchItemDetailsList();
//   }, []);

//   useEffect(() => {
//     if (itemId) {
//       const fetchItemDetails = async () => {
//         try {
//           const response = await axios.get(`/api/items/${itemId}`);
//           setItemDetails(response.data);
//         } catch (error) {
//           console.error("Error fetching item details:", error);
//         }
//       };
//       fetchItemDetails();
//     } else {
//       generateItemCode();
//     }
//   }, [itemId]);

//   const generateItemCode = async () => {
//     try {
//       const lastCodeRes = await fetch("/api/lastItemCode");
//       const { lastItemCode } = await lastCodeRes.json();
//       const lastNumber = parseInt(lastItemCode.split("-")[1], 10) || 0;
//       let newNumber = lastNumber + 1;

//       let generatedCode = "";
//       let codeExists = true;

//       while (codeExists) {
//         generatedCode = `ITEM-${newNumber.toString().padStart(4, "0")}`;
//         const checkRes = await axios.get(
//           `/api/checkItemCode?code=${generatedCode}`
//         );
//         const { exists } = await checkRes.data;
//         if (!exists) break;
//         newNumber++;
//       }

//       setItemDetails((prev) => ({
//         ...prev,
//         itemCode: generatedCode,
//       }));
//     } catch (error) {
//       console.error("Failed to generate code:", error);
//     }
//   };
//   // ** Quality Check Handlers **
//   const handleQualityCheckClick = () => {
//     setShowQualityCheckForm(!showQualityCheckForm);
//   };

//   const handleInputChange = (index, event) => {
//     const values = [...itemDetails.qualityCheckDetails];
//     values[index][event.target.name] = event.target.value;
//     setItemDetails({ ...itemDetails, qualityCheckDetails: values });
//   };

//   const addQualityCheckItem = () => {
//     setItemDetails({
//       ...itemDetails,
//       qualityCheckDetails: [
//         ...itemDetails.qualityCheckDetails,
//         { srNo: "", parameter: "", min: "", max: "" },
//       ],
//     });
//   };

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     setItemDetails((prev) => ({ ...prev, category: category.name }));
//   };

//   const validate = () => {
//     const requiredFields = ["itemName", "category", "unitPrice", "quantity"];

//     for (const field of requiredFields) {
//       if (!itemDetails[field]) {
//         alert(`Please fill the required field: ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get("/api/items");
//         setItemList(response.data || []);
//       } catch (err) {
//         console.error("Error fetching items:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleEdit = (item) => {
//     console.log("Editing item:", item);
//     setItemDetails(item);
//     setIsEditing(item); // Assuming you have a state to store the selected item
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/items/${id}`);

//       // Remove the item from state
//       // setItems((prevItems) => prevItems.filter((item) => item._id !== id));

//       alert("Item deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       alert("Failed to delete item");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // if (!validate()) return;

//     try {
//       if (isEditing) {
//         const res = await axios.put(
//           `/api/items/${itemDetails._id}`,
//           itemDetails
//         );
//         setItems(
//           items.map((item) => (item._id === itemDetails._id ? res.data : item))
//         );
//         alert("Item updated successfully!");
//       } else {
//         const res = await axios.post("/api/items", itemDetails);
//         console.log(itemDetails);
//         setItems([...items, res.data]);
//         alert("Item created successfully!");
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert(error.response?.data?.error || "Form submission error");
//     }
//   };

//   const resetForm = () => {
//     setItemDetails({
//       itemCode: "",
//       itemName: "",
//       description: "",
//       category: "",
//       unitPrice: "",
//       quantity: "",
//       reorderLevel: "",
//       // supplier: "",
//       // weight: "",
//       // dimensions: "",
//       itemType: "",
//       uom: "",
//       managedBy: "",
//       managedValue: "",
//       length: "",
//       width: "",
//       height: "",
//       weight: "",
//       gnr: false,
//       delivery: false,
//       productionProcess: false,
//       qualityCheck: false,
//       qualityCheckDetails: [],
//       taxRate: "",
//       status: "",
//       active: true,
//     });
//     setIsEditing(false);
//   };

//   const [showWarehouseModal, setShowWarehouseModal] = useState(false);
//   // const [selectedWarehouse, setSelectedWarehouse] = useState(null);

//   // const handleWarehouseSelect = (warehouse) => {
//   //   setSelectedWarehouse(warehouse);
//   // };








//   // section of warehouse code
//   const [showWarehouseSelector, setShowWarehouseSelector] = useState(false);
//   const [warehouseSearch, setWarehouseSearch] = useState("");
//   const [warehouses, setWarehouses] = useState([]);
//   const [filteredWarehouses, setFilteredWarehouses] = useState([]);
//   const [selectedWarehouse, setSelectedWarehouse] = useState(null);

//   // Fetch warehouses from API on mount
//   useEffect(() => {
//     const fetchWarehouses = async () => {
//       try {
//         const response = await axios.get("/api/warehouse");
//         // Assuming your API returns { success: true, data: [...] }
//         const whs = response.data || [];
//         setWarehouses(whs);
//         setFilteredWarehouses(whs);
//       } catch (error) {
//         console.error("Error fetching warehouses:", error);
//       }
//     };

//     fetchWarehouses();
//   }, []);

//   // Filter warehouses when search query changes
//   useEffect(() => {
//     const query = warehouseSearch.toLowerCase();
//     const filtered = warehouses.filter((wh) => {
//       return (
//         wh.warehouseName.toLowerCase().includes(query) ||
//         wh.warehouseCode.toLowerCase().includes(query)
//       );
//     });
//     setFilteredWarehouses(filtered);
//   }, [warehouseSearch, warehouses]);

//   // Handle selecting a warehouse
//   const handleWarehouseSelect = (warehouse) => {
//     setSelectedWarehouse(warehouse);
//     setShowWarehouseSelector(false);
//   };

//   // Toggle the warehouse selector form
//   const handleToggleClick = () => {
//     setShowWarehouseSelector(!showWarehouseSelector);
//   };

//   return (
//     <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//         {isEditing ? "Edit Item" : "Create Item"}
//       </h1>

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Code
//             </label>
//             <input
//               type="text"
//               value={itemDetails.itemCode}
//               readOnly
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={itemDetails.itemName}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   itemName: e.target.value,
//                 })
//               }
//               required
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Category <span className="text-red-500">*</span>
//             </label>
//             {/* <CategorySearch onSelectCategory={handleCategorySelect} /> */}
//             <ItemGroupSearch onSelectItemGroup={handleCategorySelect} />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Unit Price <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="string"
//               value={itemDetails.unitPrice}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   unitPrice: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Save Quantity <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="string"
//               value={itemDetails.quantity}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   quantity: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Reorder Level
//             </label>
//             <input
//               type="string"
//               value={itemDetails.reorderLevel}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   reorderLevel: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               value={itemDetails.description}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   description: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full h-24"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Tax Rate (%)
//             </label>
//             <input
//               type="string"
//               value={itemDetails.taxRate}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   taxRate: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Unit of Measurement
//             </label>
//             <select
//               value={itemDetails.uom}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   uom: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option>Select </option>
//               <option value="KG">KG</option>
//               <option value="MTP">MTP</option>
//               <option value="PC">PC</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Item Type
//             </label>
//             <select
//               value={itemDetails.itemType}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   itemType: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option>Select </option>
//               <option value="Product">Product</option>
//               <option value="Service">Service</option>
//             </select>
//           </div>
//           {/* 
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Managed By
//             </label>
//             <select
//               value={itemDetails.managedBy}
//               onChange={(e) =>
//                 setItemDetails({ ...itemDetails, managedBy: e.target.value })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option>Select </option>
//               <option value="batch">Batch</option>
//               <option value="serial">Serial</option>
//             </select>
//           </div> */}

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Managed By
//             </label>
//             <select
//               value={itemDetails.managedBy}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   managedBy: e.target.value,
//                   managedValue: "",
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value="">Select</option>
//               <option value="batch">Batch</option>
//               <option value="serial">Serial</option>
//             </select>
//           </div>

//           {/* Conditional Input Field */}
//           {itemDetails.managedBy && (
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Enter{" "}
//                 {itemDetails.managedBy === "batch"
//                   ? "Batch Number"
//                   : "Serial Number"}
//               </label>
//               <input
//                 type="text"
//                 value={itemDetails.managedValue}
//                 onChange={(e) =>
//                   setItemDetails({
//                     ...itemDetails,
//                     managedValue: e.target.value,
//                   })
//                 }
//                 placeholder={`Enter ${
//                   itemDetails.managedBy === "batch" ? "Batch" : "Serial"
//                 } Number`}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               />
//             </div>
//           )}

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               value={itemDetails.active}
//               onChange={(e) =>
//                 setItemDetails({
//                   ...itemDetails,
//                   active: e.target.value === "true",
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               <option value={true}>Active</option>
//               <option value={false}>Inactive</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Length
//             </label>
//             <input
//               type="text"
//               value={itemDetails.length}
//               onChange={(e) =>
//                 setItemDetails({ ...itemDetails, length: e.target.value })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Width
//             </label>
//             <input
//               type="text"
//               value={itemDetails.width}
//               onChange={(e) =>
//                 setItemDetails({ ...itemDetails, width: e.target.value })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Height
//             </label>
//             <input
//               type="text"
//               value={itemDetails.height}
//               onChange={(e) =>
//                 setItemDetails({ ...itemDetails, height: e.target.value })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Weight
//             </label>
//             <input
//               type="text"
//               value={itemDetails.weight}
//               onChange={(e) =>
//                 setItemDetails({ ...itemDetails, weight: e.target.value })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>
        

//         <div>
//           {/* <label className="text-sm font-medium text-gray-700 mb-2">  */}

//           <button
//             onClick={handleQualityCheckClick}
//             className="ml-3 text-gray-50 bg-slate-500 rounded p-2 hover:bg-slate-600"
//           >
//             <span className="ml-2 font-bold ">Quality Check</span>
//           </button>

//           {/* </label> */}

//           {/* Conditionally Rendered Form Instead of Modal */}
//           {showQualityCheckForm && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-100">
//               <div className=" flex flex-row gap-2">
//                 <div className="mb-4">
//                   <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <input
//                       name="GRN"
//                       type="checkbox"
//                       checked={itemDetails.gnr}
//                       onChange={(e) =>
//                         setItemDetails({
//                           ...itemDetails,
//                           gnr: e.target.checked,
//                         })
//                       }
//                       className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2">GRN</span>
//                   </label>
//                 </div>
//                 <div className="mb-4">
//                   <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <input
//                       type="checkbox"
//                       name="Delivery"
//                       checked={itemDetails.delivery}
//                       onChange={(e) =>
//                         setItemDetails({
//                           ...itemDetails,
//                           delivery: e.target.checked,
//                         })
//                       }
//                       className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2">Delivery</span>
//                   </label>
//                 </div>
//                 <div className="mb-4">
//                   <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <input
//                       type="checkbox"
//                       name="Production Process"
//                       checked={itemDetails.productionProcess}
//                       onChange={(e) =>
//                         setItemDetails({
//                           ...itemDetails,
//                           productionProcess: e.target.checked,
//                         })
//                       }
//                       className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2">Production Process</span>
//                   </label>
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold p-5">Quality Check Form</h3>
//               <div className="space-y-2">
//                 {itemDetails.qualityCheckDetails.map((item, index) => (
//                   <div key={index} className="flex space-x-2">
//                     <input
//                       type="text"
//                       name="srNo"
//                       placeholder="Sr No"
//                       value={item.srNo}
//                       onChange={(e) => handleInputChange(index, e)}
//                       className="border p-1 rounded w-1/4"
//                     />
//                     <input
//                       type="text"
//                       name="parameter"
//                       placeholder="Parameter"
//                       value={item.parameter}
//                       onChange={(e) => handleInputChange(index, e)}
//                       className="border p-1 rounded w-1/4"
//                     />
//                     <input
//                       type="text"
//                       name="min"
//                       placeholder="Min"
//                       value={item.min}
//                       onChange={(e) => handleInputChange(index, e)}
//                       className="border p-1 rounded w-1/4"
//                     />
//                     <input
//                       type="text"
//                       name="max"
//                       placeholder="Max"
//                       value={item.max}
//                       onChange={(e) => handleInputChange(index, e)}
//                       className="border p-1 rounded w-1/4"
//                     />
//                   </div>
//                 ))}
//                 <div className="mt-2">
//                   <button
//                     type="button"
//                     onClick={addQualityCheckItem}
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                   >
//                     Add
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowQualityCheckForm(false)}
//                     className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/*------------------------------------------ section of warehouse --------------------------------- */}
//         <div className="mt-4">
//         <button
//           onClick={goToInventory}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
//         >
//           View Stock Warehouses
//         </button>
//       </div>
        
//         </div>
//         <div className="flex gap-3 mt-8">
//           <button
//             type="submit"
//             className={`px-6 py-3 text-white font-bold rounded-lg ${
//               isEditing ? "bg-blue-600" : "bg-green-600"
//             }`}
//           >
//             {isEditing ? "Update Item" : "Create Item"}
//           </button>
//           <button
//             type="button"
//             onClick={resetForm}
//             className="bg-gray-600 text-white rounded-lg px-6 py-3 font-bold"
//           >
//             Cancel
//           </button>
//         </div>
       
//       </form>

//       <h2 className="text-2xl font-bold text-blue-600 mt-12">Item List</h2>
//       <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
//         <input
//           type="text"
//           placeholder="Search items..."
//           className="mb-4 p-2 border border-gray-300 rounded w-full"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <table className="table-auto w-full border border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Item Code</th>
//               <th className="p-2 border">Item Name</th>
//               <th className="p-2 border">Category</th>
//               <th className="p-2 border">Price</th>
//               <th className="p-2 border">Save Stock</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.map((item) => (
//               <tr key={item._id} className="hover:bg-gray-50 ">
//                 <td className="p-2 border ">{item.itemCode}</td>
//                 <td className="p-2 border">{item.itemName}</td>
//                 <td className="p-2 border">{item.category}</td>
//                 <td className="p-2 border">${item.unitPrice}</td>
//                 <td className="p-2 border">{item.quantity}</td>
//                 <td className="p-2 border flex gap-2">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="text-blue-500"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id)}
//                     className="text-red-500"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ItemManagement;

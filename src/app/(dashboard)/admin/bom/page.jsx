// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';

// export default function ProductionOrderPage() {
//   const [boms, setBoms] = useState([]);
//   const [selectedBomId, setSelectedBomId] = useState('');
//   const [bomItems, setBomItems] = useState([]);
//   const [quantity, setQuantity] = useState(1);
//   const [productionDate, setProductionDate] = useState('');

//   // Search & add item
//   const [allItems, setAllItems] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [selectedItemId, setSelectedItemId] = useState('');

//   // Load all BOMs
//   useEffect(() => {
//     axios.get('/api/bom').then(res => setBoms(res.data));
//     axios.get('/api/items').then(res => setAllItems(res.data));
//   }, []);

//   // When BOM is selected or global quantity changes, fetch its items
//   useEffect(() => {
//     if (!selectedBomId) return;
//     axios.get(`/api/bom/${selectedBomId}`)
//       .then(res => {
//         const items = res.data.items.map(it => ({
//           id: uuidv4(),
//           itemCode: it.itemCode,
//           itemName: it.itemName,
//           quantity: it.quantity,
//           requiredQty: it.quantity * quantity
//         }));
//         setBomItems(items);
//       })
//       .catch(console.error);
//   }, [selectedBomId, quantity]);

//   // Filter items for search
//   const filteredItems = allItems.filter(item =>
//     item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
//     item.itemName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   // Handle editing any field in a row
//   const handleItemChange = (id, field, value) => {
//     setBomItems(bomItems.map(item =>
//       item.id === id
//         ? { ...item, [field]: ['quantity','requiredQty'].includes(field) ? Number(value) : value }
//         : item
//     ));
//   };

//   // Add item (search-selected or blank)
//   const handleAddItem = () => {
//     if (selectedItemId) {
//       const it = allItems.find(i => i._id === selectedItemId);
//       if (it) {
//         setBomItems([...bomItems, {
//           id: uuidv4(),
//           itemCode: it.itemCode,
//           itemName: it.itemName,
//           quantity: 1,
//           requiredQty: 1
//         }]);
//         setSearchText('');
//         setSelectedItemId('');
//       }
//     } else {
//       setBomItems([...bomItems, {
//         id: uuidv4(),
//         itemCode: '',
//         itemName: '',
//         quantity: 1,
//         requiredQty: 1
//       }]);
//     }
//   };

//   // Remove an item row
//   const handleRemoveItem = id => {
//     setBomItems(bomItems.filter(item => item.id !== id));
//   };

//   const handleSaveProductionOrder = async () => {
//     try {
//       const payload = {
//         bomId: selectedBomId,
//         productionDate,
//         quantity,
//         items: bomItems
//       };
//       await axios.post('/api/production-orders', payload);
//       alert('Production Order created!');
//       setSelectedBomId('');
//       setBomItems([]);
//       setQuantity(1);
//       setProductionDate('');
//     } catch (err) {
//       console.error(err);
//       alert('Error creating Production Order');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-semibold mb-4">New Production Order</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium">Select BOM</label>
//           <select
//             className="w-full border p-2 rounded"
//             value={selectedBomId}
//             onChange={e => setSelectedBomId(e.target.value)}
//           >
//             <option value="">-- choose --</option>
//             {boms.map(b => (
//               <option key={b._id} value={b._id}>{b.productNo} - {b.productDesc}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Quantity</label>
//           <input
//             type="number" min={1}
//             className="w-full border p-2 rounded"
//             value={quantity}
//             onChange={e => setQuantity(+e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Production Date</label>
//           <input
//             type="date"
//             className="w-full border p-2 rounded"
//             value={productionDate}
//             onChange={e => setProductionDate(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Search & Add Item */}
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           className="border p-2 rounded-l flex-1 max-w-md"
//           placeholder="Search item by code or name..."
//           value={searchText}
//           onChange={e => setSearchText(e.target.value)}
//         />
//         <select
//           className="border-t border-b p-2"
//           value={selectedItemId}
//           onChange={e => setSelectedItemId(e.target.value)}
//         >
//           <option value="">Select Item</option>
//           {filteredItems.map(item => (
//             <option key={item._id} value={item._id}>
//               {item.itemCode} - {item.itemName}
//             </option>
//           ))}
//         </select>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-r"
//           onClick={handleAddItem}
//         >Add</button>
//       </div>

//       <div className="flex justify-between mb-4">
//         <h3 className="text-lg font-medium">Items</h3>
//       </div>

//       <table className="w-full table-auto border-collapse border text-sm mb-6">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Item Code</th>
//             <th className="border p-2">Item Name</th>
//             <th className="border p-2">Unit Qty</th>
//             <th className="border p-2">Req. Qty</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bomItems.map(item => (
//             <tr key={item.id} className="hover:bg-gray-50">
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   className="w-full border p-1 rounded"
//                   value={item.itemCode}
//                   onChange={e => handleItemChange(item.id, 'itemCode', e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   className="w-full border p-1 rounded"
//                   value={item.itemName}
//                   onChange={e => handleItemChange(item.id, 'itemName', e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   className="w-full border p-1 rounded text-right"
//                   value={item.quantity}
//                   onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   className="w-full border p-1 rounded text-right"
//                   value={item.requiredQty}
//                   onChange={e => handleItemChange(item.id, 'requiredQty', e.target.value)}
//                 />
//               </td>
//               <td className="border p-2 text-center">
//                 <button
//                   className="text-red-500 hover:underline"
//                   onClick={() => handleRemoveItem(item.id)}
//                 >Remove</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end">
//         <button
//           className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//           onClick={handleSaveProductionOrder}
//         >Create Order</button>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BOMPage() {
  // Product & form state
  const [productNo, setProductNo] = useState("LM4029");
  const [productDesc, setProductDesc] = useState("LeMon 4029 Printer");
  const [warehouse, setWarehouse] = useState("");
  const [priceList, setPriceList] = useState("");
  const [bomType, setBomType] = useState("Production");
  const [xQuantity, setXQuantity] = useState(1);
  const [distRule, setDistRule] = useState("");
  const [project, setProject] = useState("");

  // Data arrays fetched from API
  const [apiItems, setApiItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  // BOM table items
  const [bomItems, setBomItems] = useState([]);

  // Search & selection for adding items
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");

  // Fetch master items, warehouses, price lists on mount
  useEffect(() => {
    axios.get('/api/items')
      .then(res => setApiItems(res.data || []))
      .catch(err => console.error('Error fetching items:', err));
    axios.get('/api/warehouse')
      .then(res => setWarehouses(res.data || []))
      .catch(err => console.error('Error fetching warehouses:', err));
    axios.get('/api/price-list')
      .then(res => setPriceLists(res.data || []))
      .catch(err => console.error('Error fetching price lists:', err));
  }, []);

  // Filter items by code or name
  const filteredItems = apiItems.filter(item => {
    const code = (item.itemCode ?? "").toLowerCase();
    const name = (item.itemName ?? "").toLowerCase();
    const txt = searchText.toLowerCase();
    return code.includes(txt) || name.includes(txt);
  });

  // Add selected item to BOM
  const handleAddItem = () => {
    const item = apiItems.find(i => i._id === selectedItemId);
    if (!item) return;
    if (bomItems.some(i => i._id === selectedItemId)) {
      alert('Item already added!');
      return;
    }
    setBomItems([...bomItems, {
      _id: item._id,
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: 1,
      warehouse,
      issueMethod: 'Backflush',
      priceList,
      unitPrice: item.unitPrice ?? 0,
      total: item.unitPrice ?? 0
    }]);
    setSelectedItemId('');
    setSearchText('');
  };

  // Update item quantity and total
  const handleQtyChange = (idx, qty) => {
    const arr = [...bomItems];
    arr[idx].quantity = qty;
    arr[idx].total = qty * (arr[idx].unitPrice ?? 0);
    setBomItems(arr);
  };

  // Sum of totals
  const totalSum = bomItems.reduce((acc, i) => acc + (i.total ?? 0), 0);


  const handleSaveBOM = async () => {
    try {
      const payload = {
        productNo,
        productDesc,
        warehouse,
        priceList,
        bomType,
        xQuantity,
        distRule,
        project,
        items: bomItems,
        total: totalSum
      };
      const response = await axios.post('/api/bom', payload);
      alert('BOM saved successfully!');
      // Optional: reset form
      // setBomItems([]); setProductNo(""); ...
    } catch (err) {
      console.error('Error saving BOM:', err);
      alert('Failed to save BOM. Check console for details.');
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-6">Bill of Materials</h2>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Product Info & Warehouse/Price List */}
        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium">Product No.</label>
            <input
              value={productNo}
              onChange={e => setProductNo(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div> */}

<div>
  <label className="block text-sm font-medium">Product No.</label>
  <input
    type="text"
    placeholder="Search product..."
    value={productNo}
    onChange={(e) => setProductNo(e.target.value)}
    className="w-full border p-2 rounded"
    onFocus={() => setShowProductSuggestions(true)}
  />
  {productNo && showProductSuggestions && (
    <ul className="border bg-white max-h-48 overflow-y-auto rounded shadow absolute z-10 w-full">
      {apiItems
        .filter(item => {
          const txt = productNo.toLowerCase();
          return (
            item.itemCode?.toLowerCase().includes(txt) ||
            item.itemName?.toLowerCase().includes(txt)
          );
        })
        .map(item => (
          <li
            key={item._id}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setProductNo(item.itemCode);
              setProductDesc(item.itemName);
              setShowProductSuggestions(false);
            }}
          >
            {item.itemCode} - {item.itemName}
          </li>
        ))}
    </ul>
  )}
</div>


          <div>
            <label className="block text-sm font-medium">Product Description</label>
            <input
              value={productDesc}
              onChange={e => setProductDesc(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Warehouse</label>
            <select
              value={warehouse}
              onChange={e => setWarehouse(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>
                  {w.warehouseCode} - {w.warehouseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Price List</label>
            <select
              value={priceList}
              onChange={e => setPriceList(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Price List</option>
              {priceLists.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Extra Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">BOM Type</label>
            <select
              value={bomType}
              onChange={e => setBomType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Production">Production</option>
              <option value="Sales">Sales</option>
              <option value="Template">Template</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">X Quantity</label>
            <input
              type="number"
              min={1}
              value={xQuantity}
              onChange={e => setXQuantity(+e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Distribution Rule</label>
            <input
              value={distRule}
              onChange={e => setDistRule(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Project</label>
            <input
              value={project}
              onChange={e => setProject(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </div>

      {/* Search & Add Item */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search item by code or name..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="border p-2 rounded-l flex-1 max-w-md"
        />
        <select
          value={selectedItemId}
          onChange={e => setSelectedItemId(e.target.value)}
          className="border-t border-b p-2"
        >
          <option value="">Select Item</option>
          {filteredItems.map(item => (
            <option key={item._id} value={item._id}>
              {item.itemCode} - {item.itemName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>

      {/* BOM Table */}
      <table className="w-full table-auto border-collapse border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Item Code</th>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Warehouse</th>
            <th className="border p-2">Issue Method</th>
            <th className="border p-2">Price List</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {bomItems.map((item, idx) => (
            <tr key={item._id}>
              <td className="border p-2 text-center">{idx + 1}</td>
              <td className="border p-2">{item.itemCode}</td>
              <td className="border p-2">{item.itemName}</td>
              <td className="border p-2 w-20">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleQtyChange(idx, +e.target.value)}
                  className="w-full border rounded px-1"
                />
              </td>
              <td className="border p-2">{item.warehouseName}</td>
              <td className="border p-2">{item.issueMethod}</td>
              <td className="border p-2">{item.priceList}</td>
              <td className="border p-2 text-right">{(item.unitPrice ?? 0).toFixed(2)}</td>
              <td className="border p-2 text-right">{(item.total ?? 0).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td colSpan={8} className="border p-2 text-right">Total:</td>
            <td className="border p-2 text-right">{totalSum.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
      <button
    onClick={handleSaveBOM}
    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
  >
    Save BOM
  </button>
        <button className="bg-gray-400 text-white px-6 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function ARInvoiceForm() {
  const [formData, setFormData] = useState({
    no: "",
    status: "",
    postingDate: "",
    validUntil: "",
    documentDate: "",
    customerCode: "",
    customerName: "",
    contactPerson: "",
    refNumber: "",
    items: [
      {
        itemCode: "",
        itemDescription: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
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
    totalAfterGST: 0,
    appledAnmount:0,
    balanceDue:0,

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemCode: "",
          itemDescription: "",
          quantity: 0,
          unitPrice: 0,
          discount: 0,
          priceAfterDiscount: 0,
          totalAmount: 0,
          gstAmount: 0,
          tdsAmount: 0,
        },
      ],
    }));
  };

  return (
    <div className="p-10 m-20 bg-gray-100  rounded-lg shadow-2xl ">
      <h1 className="text-xl font-bold mb-4">purchase invoice</h1>

      {/* Main Form Section */}
      <div className="grid grid-cols-3 gap-4 ">
        <div>
          <label className="block mb-2">No</label>
          <input
            type="text"
            name="no"
            value={formData.no}
            onChange={handleInputChange}
            className="w-full p-2 border rounded border-orange-300 hover:border-orange-50 focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label className="block mb-2">customerCode</label>
          <input
            type="text"
            name="customerCode"
            value={formData.customerCode}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Posting Date</label>
          <input
            type="date"
            name="postingDate"
            value={formData.postingDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Document Date</label>
          <input
            type="date"
            name="documentDate"
            value={formData.documentDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Customer Code</label>
          <input
            type="text"
            name="customerCode"
            value={formData.customerCode}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Reference Number</label>
          <input
            type="text"
            name="refNumber"
            value={formData.refNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Items Section */}
      {/* <h2 className="text-lg font-semibold mt-6">Items</h2>
      
      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-9 gap-4 mt-4">
          <input
            type="text"
            name="itemCode"
            placeholder="Item Code"
            value={item.itemCode}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="itemDescription"
            placeholder="Item Description"
            value={item.itemDescription}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            value={item.unitPrice}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={item.discount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="priceAfterDiscount"
            placeholder="Price After Discount"
            value={item.priceAfterDiscount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={item.totalAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="gstAmount"
            placeholder="GST Amount"
            value={item.gstAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="tdsAmount"
            placeholder="TDS Amount"
            value={item.tdsAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
        </div>
      ))}
      <button
        onClick={addItemRow}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Item
      </button> */}

      {/* Items Section */}
      <h2 className="text-lg font-semibold mt-6">Items</h2>
     <div className="grid grid-cols-1 m-5 p-10">
     <div className="grid grid-cols-11 gap-2 font-semibold mt-4">
        <span>Item Code</span>
        <span>Item Description</span>
        <span>Quantity</span>
        <span>Unit Price</span>
        <span>Discount</span>
        <span>Price</span>
        <span>Total</span>
        <span>GST</span>
        <span>TDS</span>
      </div>
      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-11 gap-2 mt-4">
          <input
            type="text"
            name="itemCode"
            placeholder="Item Code"
            value={item.itemCode}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="itemDescription"
            placeholder="Item Description"
            value={item.itemDescription}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            value={item.unitPrice}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount"
            value={item.discount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="priceAfterDiscount"
            placeholder="Price After Discount"
            value={item.priceAfterDiscount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={item.totalAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="gstAmount"
            placeholder="GST Amount"
            value={item.gstAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="tdsAmount"
            placeholder="TDS Amount"
            value={item.tdsAmount}
            onChange={(e) => handleItemChange(index, e)}
            className="p-2 border rounded"
          />
        </div>
      ))}
     <div className="grid-cols-4 gap-4">
     <button
        onClick={addItemRow}
        className="mt-2 p-2  text-white rounded hover:bg-orange-400 "
      >
        ➕
      </button>
     </div>
     </div>

     

      {/* Other Fields salesEmployee  */}

    
      <div className="grid grid-cols-1 justify-around p-8 m-8">
      <div className="grid grid-cols-2 gap-4  mt-6">
      
        <div>
          <label className="block mb-2">totalAfterGST</label>
          <input
            type="number"
            name="totalAfterGST"
            value={formData.totalAfterGST}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">totalBeforeDiscount</label>
          <input
            type="number"
            name="totalBeforeDiscount"
            value={formData.totalBeforeDiscount}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Freight</label>
          <input
            type="number"
            name="freight"
            value={formData.freight}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Rounding</label>
          <input
            type="number"
            name="rounding"
            value={formData.rounding}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Appled Amount</label>
          <input
            type="number"
            name="appledAnmount"
            value={formData.appledAnmount}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Balance Due</label>
          <input
            type="number"
            name="balanceDue"
            value={formData.balanceDue}
            onChange={handleInputChange}
            className="w-15 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">salesEmployee</label>
          <input
            type="text"
            name="freight"
            value={formData.salesEmployee}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
        <label className="block mb-2">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        ></textarea>
        </div>
      </div>
    </div>

   <div className="grid grid-flow-col-dense">
   <button className="m-5 p-2 w-32  bg-orange-400 text-white rounded-xl hover:bg-orange-300">
        Add
      </button>
      <button className="m-5 p-2 w-32  bg-orange-400 text-white rounded-xl hover:bg-orange-300">
        Cancel
      </button>
      <button className="m-5 p-2 w-32  bg-orange-400 text-white rounded-xl hover:bg-orange-300">
        Copy From
      </button>
      <button className="m-5 p-2 w-32 bg-orange-400 text-white rounded-xl hover:bg-orange-300">
        Copy TO
      </button>
   </div>
    </div>
  );
}
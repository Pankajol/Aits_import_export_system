"use client"
import React, { useState } from "react";

const PurchaseInvoiceForm = () => {
  const initialFormData = {
    supplier: "",
    date: "",
    postingTime: "",
    company: "",
    supplierInvoiceNo: "",
    supplierInvoiceDate: "",
    costCenter: "",
    project: "",
    items: [{ itemCode: "", acceptedQty: "", rate: "", amount: "" }],
    taxCategory: "",
    shippingRule: "",
    purchaseTaxes: [{ type: "", accountHead: "", taxRate: "", amount: "", total: "" }],
    supplierAddress: "",
    contactPerson: "",
    companyShippingAddress: "",
    shippingAddress: "",
    companyBillingAddress: "",
    billingAddress: "",
    paymentTerms: "",
    orderStatus: "",
    status: "",
    creditTo: "",
    isOpeningEntry: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleTaxChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTaxes = [...formData.purchaseTaxes];
    updatedTaxes[index][name] = value;
    setFormData({ ...formData, purchaseTaxes: updatedTaxes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic can be added here
    console.log("Purchase Invoice submitted:", formData);
  };

  const handleCancel = () => {
    setFormData(initialFormData); // Reset form data on cancel
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemCode: "", acceptedQty: "", rate: "", amount: "" }],
    });
  };

  const handleAddTax = () => {
    setFormData({
      ...formData,
      purchaseTaxes: [...formData.purchaseTaxes, { type: "", accountHead: "", taxRate: "", amount: "", total: "" }],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Purchase Invoice</h1>

      {/* Supplier and Posting Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Supplier", name: "supplier", type: "text" },
          { label: "Date", name: "date", type: "date" },
          { label: "Posting Time", name: "postingTime", type: "time" },
          { label: "Company", name: "company", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Supplier Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[
          { label: "Supplier Invoice No", name: "supplierInvoiceNo", type: "text" },
          { label: "Supplier Invoice Date", name: "supplierInvoiceDate", type: "date" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Accounting Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[
          { label: "Cost Center", name: "costCenter", type: "text" },
          { label: "Project", name: "project", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Items Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {[
              { label: "Item Code", name: "itemCode", type: "text" },
              { label: "Accepted Qty", name: "acceptedQty", type: "number" },
              { label: "Rate", name: "rate", type: "number" },
              { label: "Amount", name: "amount", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={item[name]}
                  onChange={(e) => handleItemChange(index, e)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder={`Enter ${label}`}
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleAddItem}
        >
          Add Row
        </button>
      </div>

      {/* Taxes Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Purchase Tax & Charges</h3>
        {formData.purchaseTaxes.map((tax, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
            {[
              { label: "Type", name: "type", type: "text" },
              { label: "Account Head", name: "accountHead", type: "text" },
              { label: "Tax Rate", name: "taxRate", type: "number" },
              { label: "Amount", name: "amount", type: "number" },
              { label: "Total", name: "total", type: "number" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={tax[name]}
                  onChange={(e) => handleTaxChange(index, e)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder={`Enter ${label}`}
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleAddTax}
        >
          Add Row
        </button>
      </div>

      {/* Supplier Address & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[
          { label: "Supplier Address", name: "supplierAddress", type: "text" },
          { label: "Contact Person", name: "contactPerson", type: "text" },
          { label: "Company Shipping Address", name: "companyShippingAddress", type: "text" },
          { label: "Shipping Address", name: "shippingAddress", type: "text" },
          { label: "Company Billing Address", name: "companyBillingAddress", type: "text" },
          { label: "Billing Address", name: "billingAddress", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Payment Terms, Order Status, and Accounting Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[
          { label: "Payment Terms", name: "paymentTerms", type: "text" },
          { label: "Order Status", name: "orderStatus", type: "text" },
          { label: "Status", name: "status", type: "text" },
          { label: "Credit To", name: "creditTo", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}
      </div>

      {/* Is Opening Entry */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Is Opening Entry</label>
        <input
          type="checkbox"
          name="isOpeningEntry"
          checked={formData.isOpeningEntry}
          onChange={(e) => setFormData({ ...formData, isOpeningEntry: e.target.checked })}
          className="h-4 w-4 border-gray-300 rounded"
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 focus:outline-none"
        >
          Add
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 focus:outline-none"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PurchaseInvoiceForm;

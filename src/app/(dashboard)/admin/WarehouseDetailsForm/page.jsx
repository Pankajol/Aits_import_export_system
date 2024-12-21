"use client"
import React, { useState } from "react";

const WarehouseDetailsForm = () => {
  const initialFormData = {
    warehouseName: "",
    parentWarehouse: "",
    account: "",
    company: "",
    phoneNo: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pin: "",
    warehouseType: "",
    defaultInTransit: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.warehouseName) newErrors.warehouseName = "This field is required.";
    if (!formData.account) newErrors.account = "This field is required.";
    if (!formData.phoneNo) newErrors.phoneNo = "This field is required.";
    if (!formData.addressLine1) newErrors.addressLine1 = "This field is required.";
    if (!formData.city) newErrors.city = "This field is required.";
    if (!formData.state) newErrors.state = "This field is required.";
    if (!formData.pin) newErrors.pin = "This field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Warehouse details submitted successfully:", formData);
      alert("Warehouse details submitted successfully!");
      setFormData(initialFormData); // Reset form data after successful submission
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData); // Reset form data when canceling
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Warehouse Details</h1>

      {/* Warehouse Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[ 
          { label: "Warehouse Name", name: "warehouseName", type: "text", required: true },
          { label: "Parent Warehouse", name: "parentWarehouse", type: "text" },
          { label: "Account", name: "account", type: "text", required: true },
          { label: "Company", name: "company", type: "text" },
        ].map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
              required={required}
            />
            {errors[name] && <span className="text-red-500 text-sm">{errors[name]}</span>}
          </div>
        ))}
      </div>

      {/* Warehouse Contact Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[ 
          { label: "Phone No", name: "phoneNo", type: "text", required: true },
          { label: "Mobile No", name: "mobileNo", type: "text" },
          { label: "Address Line 1", name: "addressLine1", type: "text", required: true },
          { label: "Address Line 2", name: "addressLine2", type: "text" },
          { label: "City", name: "city", type: "text", required: true },
          { label: "State", name: "state", type: "text", required: true },
          { label: "Pin", name: "pin", type: "text", required: true },
        ].map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={`Enter ${label}`}
              required={required}
            />
            {errors[name] && <span className="text-red-500 text-sm">{errors[name]}</span>}
          </div>
        ))}
      </div>

      {/* Warehouse Transit Section */}
      <div className="mt-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="defaultInTransit"
            checked={formData.defaultInTransit}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Default in Transit Warehouse</label>
        </div>
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

export default WarehouseDetailsForm;

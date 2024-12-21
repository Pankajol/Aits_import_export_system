'use client';

import { useState } from 'react';

export default function SupplierForm() {
  const initialFormData = {
    customerCode: '',
    customerName: '',
    customerGroup: '',
    customerType: '',
    emailId: '',
    mobileNumber: '',
    telephone: '',
    telephone2: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',
    paymentTerms: '',
    gstNumber: '',
    gstCategory: '',
    pan: '',
    purchasePersonName: '',
    commissionRate: '',
    glAccount: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});  // To track form validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);
      alert('Form Submitted Successfully!');
      setFormData(initialFormData);  // Reset form after submission
      setErrors({});
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const handleCancel = () => {
    setFormData({ ...initialFormData });
    setErrors({});
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-10 max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Supplier Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier Section */}
          <SectionTitle title="Supplier" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Customer Code" name="customerCode" value={formData.customerCode} onChange={handleChange} error={errors.customerCode} />
            <InputField label="Customer Group" name="customerGroup" value={formData.customerGroup} onChange={handleChange} error={errors.customerGroup} />
            <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} />
            <InputField label="Customer Type" name="customerType" value={formData.customerType} onChange={handleChange} error={errors.customerType} />
          </div>

          {/* Contact Detail Section */}
          <SectionTitle title="Contact Detail" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Email ID" name="emailId" value={formData.emailId} onChange={handleChange} error={errors.emailId} />
            <InputField label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
            <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} />
            <InputField label="Telephone 2" name="telephone2" value={formData.telephone2} onChange={handleChange} error={errors.telephone2} />
          </div>

          {/* Address Detail Section */}
          <SectionTitle title="Address Detail" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="font-medium mb-2">Address - Bill To</h4>
              <AddressFields prefix="billing" formData={formData} handleChange={handleChange} errors={errors} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Address - Ship To</h4>
              <AddressFields prefix="shipping" formData={formData} handleChange={handleChange} errors={errors} />
            </div>
          </div>

          {/* Other Detail Section */}
          <SectionTitle title="Other Detail" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} error={errors.paymentTerms} />
            <InputField label="Purchase Person Name" name="purchasePersonName" value={formData.purchasePersonName} onChange={handleChange} error={errors.purchasePersonName} />
            <InputField label="GST NUMBER" name="gstNumber" value={formData.gstNumber} onChange={handleChange} error={errors.gstNumber} />
            <InputField label="Commission Rate" name="commissionRate" value={formData.commissionRate} onChange={handleChange} error={errors.commissionRate} />
            <InputField label="GST Category" name="gstCategory" value={formData.gstCategory} onChange={handleChange} error={errors.gstCategory} />
            <InputField label="GL ACCT" name="glAccount" value={formData.glAccount} onChange={handleChange} error={errors.glAccount} />
            <InputField label="PAN" name="pan" value={formData.pan} onChange={handleChange} error={errors.pan} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-200">Add</button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Section Title Component
function SectionTitle({ title }) {
  return <h3 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h3>;
}

// Reusable InputField Component with Error Handling
function InputField({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-400`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Address Fields Component with Error Handling
function AddressFields({ prefix, formData, handleChange, errors }) {
  return (
    <>
      <InputField label="Address 1" name={`${prefix}Address1`} value={formData[`${prefix}Address1`]} onChange={handleChange} error={errors[`${prefix}Address1`]} />
      <InputField label="Address 2" name={`${prefix}Address2`} value={formData[`${prefix}Address2`]} onChange={handleChange} error={errors[`${prefix}Address2`]} />
      <InputField label="City" name={`${prefix}City`} value={formData[`${prefix}City`]} onChange={handleChange} error={errors[`${prefix}City`]} />
      <InputField label="State" name={`${prefix}State`} value={formData[`${prefix}State`]} onChange={handleChange} error={errors[`${prefix}State`]} />
      <InputField label="Zip Code" name={`${prefix}Zip`} value={formData[`${prefix}Zip`]} onChange={handleChange} error={errors[`${prefix}Zip`]} />
      <InputField label="Country" name={`${prefix}Country`} value={formData[`${prefix}Country`]} onChange={handleChange} error={errors[`${prefix}Country`]} />
    </>
  );
}

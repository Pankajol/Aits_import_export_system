'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerForm() {
  const initialFormData = {
    customerCode: '',
    customerName: '',
    customerGroup: '',
    customerType: '',
    emailId: '',
    fromLead: '',
    mobileNumber: '',
    fromOpportunity: '',
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
    salesPersonName: '',
    commissionRate: '',
    glAccount: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers'); // Make a GET request using Axios
        setCustomers(response.data.customers); // Assuming the response contains the customers
        console.log('data',response)
      } catch (error) {
        setFetchError(error.message);
      }
    };

    fetchCustomers();
  }, []);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerCode) newErrors.customerCode = 'Customer Code is required';
    if (!formData.customerName) newErrors.customerName = 'Customer Name is required';
    if (!formData.emailId) newErrors.emailId = 'Email is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are errors
    }
  
    setErrors({}); // Reset errors if validation passes
  
    try {
      // Mock submission logic (replace this with your API call)
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Handle success
        setSuccessMessage('Customer information submitted successfully!');
        setFormData({ ...initialFormData }); // Reset the form
      } else {
        // Handle error response
        setSuccessMessage('');
        setErrors({ submit: data.message || 'Submission failed' });
      }
    } catch (error) {
      // Handle unexpected errors
      setSuccessMessage('');
      setErrors({ submit: error.message || 'An error occurred while submitting' });
    }
  };
  
  // Handle form cancel/reset
  const handleCancel = () => {
    setFormData({ ...initialFormData });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Customer Form</h2>
        {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Customer Code" name="customerCode" value={formData.customerCode} onChange={handleChange} error={errors.customerCode} />
              <InputField label="Customer Group" name="customerGroup" value={formData.customerGroup} onChange={handleChange} />
              <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} error={errors.customerName} />
              <InputField label="Customer Type" name="customerType" value={formData.customerType} onChange={handleChange} />
            </div>
          </section>

          {/* Contact Detail Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contact Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Email ID" name="emailId" value={formData.emailId} onChange={handleChange} error={errors.emailId} />
              <InputField label="From Lead" name="fromLead" value={formData.fromLead} onChange={handleChange} />
              <InputField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} />
              <InputField label="From Opportunity" name="fromOpportunity" value={formData.fromOpportunity} onChange={handleChange} />
            </div>
          </section>

          {/* Address Detail Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Address Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div>
                <h4 className="font-medium mb-2">Billing Address</h4>
                {/* Address Inputs */}
                {['billingAddress1', 'billingAddress2', 'billingCity', 'billingState', 'billingZip', 'billingCountry'].map((field) => (
                  <InputField
                    key={field}
                    label={field.replace('billing', '').replace(/([A-Z])/g, ' $1').trim()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                ))}
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                {['shippingAddress1', 'shippingAddress2', 'shippingCity', 'shippingState', 'shippingZip', 'shippingCountry'].map((field) => (
                  <InputField
                    key={field}
                    label={field.replace('shipping', '').replace(/([A-Z])/g, ' $1').trim()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>
          </section>

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

// Reusable InputField Component
function InputField({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className="w-full border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-400"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

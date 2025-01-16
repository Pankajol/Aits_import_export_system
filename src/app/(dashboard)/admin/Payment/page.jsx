"use client"
import React, { useState } from "react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    paymentType: "",
    transactionType: "", // Incoming / Outgoing
    code: "",
    customerVendor: "",
    name: "",
    selectedInvoices: [],
    amountToPay: 0,
  });

  const [invoices] = useState([
    { id: 1, number: "INV001", date: "2025-01-01", amount: 500 },
    { id: 2, number: "INV002", date: "2025-01-10", amount: 300 },
    { id: 3, number: "INV003", date: "2025-01-15", amount: 700 },
    { id: 4, number: "INV004", date: "2025-01-20", amount: 200 },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (invoiceId, invoiceAmount) => {
    const { selectedInvoices } = formData;
    if (selectedInvoices.includes(invoiceId)) {
      setFormData({
        ...formData,
        selectedInvoices: selectedInvoices.filter((id) => id !== invoiceId),
        amountToPay: formData.amountToPay - invoiceAmount,
      });
    } else {
      setFormData({
        ...formData,
        selectedInvoices: [...selectedInvoices, invoiceId],
        amountToPay: formData.amountToPay + invoiceAmount,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Form</h2>
      <div className="space-y-4">
        {/* Payment Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <input
              type="text"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter payment type"
            />
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
            </select>
          </div>
        </div>

        {/* Code and Customer/Vendor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer / Vendor</label>
            <input
              type="text"
              name="customerVendor"
              value={formData.customerVendor}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter customer/vendor"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter name"
          />
        </div>

        {/* Invoice Table */}
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-2">Select Invoices</h3>
          <table className="w-full text-sm text-left text-gray-700 border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Invoice Number</th>
                <th className="px-4 py-2">Invoice Date</th>
                <th className="px-4 py-2">Invoice Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCheckboxChange(invoice.id, invoice.amount)
                      }
                      checked={formData.selectedInvoices.includes(invoice.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2">{invoice.number}</td>
                  <td className="px-4 py-2">{invoice.date}</td>
                  <td className="px-4 py-2">${invoice.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amount to Pay */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount to Pay</label>
          <input
            type="number"
            name="amountToPay"
            value={formData.amountToPay}
            readOnly
            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Amount to pay"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => console.log("Form submitted:", formData)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => console.log("Form closed")}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

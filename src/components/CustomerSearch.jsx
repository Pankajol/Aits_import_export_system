import React, { useState } from 'react';
import useSearch from '../hooks/useSearch';

const CustomerSearch = ({ onSelectCustomer }) => {
  // Local state for the text input
  const [query, setQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // useSearch hook to fetch customer data based on query
  const customerSearch = useSearch(async (searchQuery) => {
    if (!searchQuery) return [];
    const res = await fetch(`/api/customers?search=${encodeURIComponent(searchQuery)}`);
    return res.ok ? await res.json() : [];
  });

  // Update local query and trigger the search
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    customerSearch.handleSearch(newQuery);
    setShowCustomerDropdown(true);
    if (selectedCustomer) setSelectedCustomer(null);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    onSelectCustomer(customer);
    setShowCustomerDropdown(false);
    // Use customer.customerName consistently
    setQuery(customer.customerName);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search Customer"
        value={selectedCustomer ? selectedCustomer.customerName : (query || "")}
        onChange={handleQueryChange}
        onFocus={() => setShowCustomerDropdown(true)}
        className="border px-4 py-2 w-full"
      />

      {showCustomerDropdown && (
        <div
          className="absolute border bg-white w-full max-h-40 overflow-y-auto z-50"
          style={{ top: '100%', left: 0 }}
        >
          {customerSearch.loading && <p className="p-2">Loading...</p>}
          {customerSearch.results && customerSearch.results.length > 0 ? (
            customerSearch.results.map((customer) => (
              <div
                key={customer._id}
                onClick={() => handleCustomerSelect(customer)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedCustomer && selectedCustomer._id === customer._id ? 'bg-blue-100' : ''
                }`}
              >
                {customer.customerName}
              </div>
            ))
          ) : (
            !customerSearch.loading && <p className="p-2 text-gray-500">No customers found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;

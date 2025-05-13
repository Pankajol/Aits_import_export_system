import React, { useState } from 'react';
import useSearch from '../hooks/useSearch';

const SupplierSearch = ({ onSelectSupplier }) => {
  // Local state for the text input
  const [query, setQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // useSearch hook to fetch supplier data based on query
  const supplierSearch = useSearch(async (searchQuery) => {
    if (!searchQuery) return [];
    const res = await fetch(`/api/suppliers?search=${encodeURIComponent(searchQuery)}`);
    return res.ok ? await res.json() : [];
  });

  // Update local query and trigger the search
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    supplierSearch.handleSearch(newQuery);
    setShowSupplierDropdown(true);
    if (selectedSupplier) setSelectedSupplier(null);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    onSelectSupplier(supplier);
    setShowSupplierDropdown(false);
    // Use supplier.supplierName consistently
    setQuery(supplier.supplierName);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search Supplier"
        // Always use a fallback value so that value is never undefined
        value={selectedSupplier ? selectedSupplier.supplierName : (query || "")}
        onChange={handleQueryChange}
        onFocus={() => setShowSupplierDropdown(true)}
        className="border px-4 py-2 w-full"
      />

      {showSupplierDropdown && (
        <div
          className="absolute border bg-white w-full max-h-40 overflow-y-auto z-50"
          style={{ top: '100%', left: 0 }}
        >
          {supplierSearch.loading && <p className="p-2">Loading...</p>}
          {supplierSearch.results && supplierSearch.results.length > 0 ? (
            supplierSearch.results.map((supplier) => (
              <div
                key={supplier._id} // Ensure each element has a unique key
                onClick={() => handleSupplierSelect(supplier)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedSupplier && selectedSupplier._id === supplier._id ? 'bg-blue-100' : ''
                }`}
              >
                {supplier.supplierName}
              </div>
            ))
          ) : (
            !supplierSearch.loading && <p className="p-2 text-gray-500">No suppliers found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierSearch;

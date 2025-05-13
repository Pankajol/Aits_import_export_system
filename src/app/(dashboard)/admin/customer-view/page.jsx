
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerManagement from "@/components/sampleofcurd"

import Table from "../../../../components/table"; // Import the Table component

function ViewUser() {
  const [customer, setCustomer] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomer(response.data || []); // Assuming the response contains `accounts`
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  return (
    <div className="min-h-screen flex  bg-gray-100 ">
      <div className="max-w-screen-xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">All Customers</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : (
          // <
            
           
          
          // />
           <CustomerManagement/>
         

      
        
        )}
      </div>
      {/* < Table data={customer}/> */}
    </div>

    // </div>
  );
}

export default ViewUser;

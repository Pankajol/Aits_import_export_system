import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import CountryStateSearch from "@/components/CountryStateSearch";
import GroupSearch from "@/components/groupmaster";

function CustomerManagement({ customerId,customerCode }) {
  const [customerList, setCustomerList] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const filteredCustomers = customerList.filter(
    (customer) =>
      customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.emailId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [customerDetails, setCustomerDetails] = useState({
    customerCode: "",
    customerName: "",
    customerType: "",
    emailId: "",
    mobileNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCountry: null,
    billingState: null,
    billingCity: "",
    billingZip: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCountry: null,
    shippingCity: "",
    shippingState: null,
    shippingZip: "",
    paymentTerms: "",
    gstNumber: "",
    gstCategory: "",
    pan: "",
    contactPersonName: "",
    commissionRate: "",
    glAccount: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (customerId) {
      const fetchCustomerDetails = async () => {
        try {
          const response = await axios.get(`/api/customers/${customerId}`);
          setCustomerDetails(response.data);
        } catch (error) {
          console.error("Error fetching customer details:", error);
        }
      };

      fetchCustomerDetails();
    } else {
      // Generate a new customer code if creating new customer
      generateCustomerCode();
    }
  }, [customerId]);

  const generateCustomerCode = async () => {
    try {
      const lastCodeRes = await fetch("/api/lastCustomerCode");
      const { lastCustomerCode } = await lastCodeRes.json();
      const lastNumber = parseInt(lastCustomerCode.split("-")[1], 10) || 0;
      let newNumber = lastNumber + 1;

      let generatedCode = "";
      let codeExists = true;

      while (codeExists) {
        generatedCode = `CUST-${newNumber.toString().padStart(4, "0")}`;
        const checkRes = await fetch(
          `/api/checkCustomerCode?code=${generatedCode}`
        );
        const { exists } = await checkRes.json();
        if (!exists) break;
        newNumber++;
      }

      setCustomerDetails((prev) => ({
        ...prev,
        customerCode: generatedCode,
      }));
    } catch (error) {
      console.error("Failed to generate code:", error);
    }
  };
  const [selectedGroup, setSelectedGroup] = useState(null);
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setCustomerDetails((prev) => ({ ...prev, customerGroup: group.name }));
  };

  const handleSelectBillingCountry = (country) => {
    setCustomerDetails((prev) => ({ ...prev, billingCountry: country.name }));
  };

  const handleSelectBillingState = (state) => {
    setCustomerDetails((prev) => ({ ...prev, billingState: state.name }));
  };

  const handleSelectShippingCountry = (country) => {
    setCustomerDetails((prev) => ({ ...prev, shippingCountry: country.name }));
  };

  const handleSelectShippingState = (state) => {
    setCustomerDetails((prev) => ({ ...prev, shippingState: state.name }));
  };

  const customerTypeOptions = [
    { value: "Individual", label: "Individual" },
    { value: "Business", label: "Business" },
    { value: "Government", label: "Government" },
  ];

  const validate = () => {
    const requiredFields = [
      "customerName",
      "emailId",
      "billingAddress1",
      "billingCity",
      "billingCountry",
      "billingState",
      "billingZip",
      "shippingAddress1",
      "shippingCity",
      "shippingCountry",
      "shippingState",
      "shippingZip",
    ];

    for (const field of requiredFields) {
      if (!customerDetails[field]) {
        alert(`Please fill the required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomerList(response.data || []); // Assuming the response contains `accounts`
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);



    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        if (isEditing) {
          // ✅ Update existing customer
          const res = await fetch(`/api/customers/${customerDetails._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerDetails), // ✅ Send customer data
          });
    
          const data = await res.json();
    
          if (res.ok) {
            // ✅ Update customer in state (don't remove it)
            setCustomers(customers.map((customer) =>
              customer._id === customerDetails._id ? data : customer
            ));
            alert("Customer updated successfully!");
          } else {
            console.error("Error updating customer:", data.error);
            alert(data.error || "Error updating customer");
          }
        } else {
          // ✅ Create new customer
          const res = await axios.post("/api/customers", customerDetails);
          setCustomers([...customers, res.data]); // ✅ Add new customer to the state
          alert("Customer created successfully!");
        }
    
        resetForm();
    
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(error.response?.data?.error || "There was an error submitting the form.");
      }
    };
    

  const resetForm = () => {
    setCustomerDetails({
      customerCode: "",
      customerName: "",
      customerGroup: "",
      customerType: "",
      emailId: "",
      mobileNumber: "",
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingZip: "",
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingZip: "",
      paymentTerms: "",
      gstNumber: "",
      gstCategory: "",
      pan: "",
      contactPersonName: "",
      commissionRate: "",
      glAccount: "",
    });
    setIsEditing(false);
  };

  const handleEdit = (customer) => {
    setCustomerDetails(customer);
    setIsEditing(true);
  };


  const handleDelete = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
          try {
            const res = await fetch(`/api/customers/${id}`, {
              method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
              setCustomers(customers.filter((customer) => customer._id !== id));
            } else {
              console.error('Error deleting customer:', data.error);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };

  // const handleDelete = async (customerCode) => {
  //   try {
  //     const response = await fetch(`/api/customers/${customerCode}`, {
  //       method: 'DELETE',
  //     });
  
  //     if (response.ok) {
  //       alert('Customer deleted successfully!');
  //       // Optionally, update UI to remove the customer
  //     } else {
  //       throw new Error('Failed to delete customer');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting customer:', error);
  //     alert('An error occurred while deleting the customer.');
  //   }
  // };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        {isEditing ? "Edit Customer" : "Create Customer"}
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Form Fields */}
          {/* <div>
            <label className="text-sm font-medium text-gray-700 mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerDetails.customerName}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, customerName: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2">Email ID</label>
            <input
              type="email"
              value={customerDetails.emailId}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, emailId: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Customer Code
              </label>
              <input
                type="text"
                value={customerDetails.customerCode}
                readOnly // Prevent manual editing
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                // className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerDetails.customerName}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    customerName: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                // className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Customer Group <span className="text-red-500">*</span>
              </label>
              <GroupSearch onSelectGroup={handleGroupSelect} className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <select
                name="customerType"
                value={customerDetails.customerType}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    customerType: e.target.value,
                  })
                }
                required
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                // className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {customerTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerDetails.emailId}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    emailId: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                // className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                value={customerDetails.mobileNumber}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    mobileNumber: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                // className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          {/* </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <input
                type="text"
                placeholder="Address Line 1"
                value={customerDetails.billingAddress1}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    billingAddress1: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={customerDetails.billingAddress2}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    billingAddress2: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="City"
                value={customerDetails.billingCity}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    billingCity: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <CountryStateSearch
                onSelectCountry={handleSelectBillingCountry}
                onSelectState={handleSelectBillingState}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <br />
              <input
                type="text"
                placeholder="PIN Code"
                value={customerDetails.billingZip}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    billingZip: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Shipping Address
              </label>
              <input
                type="text"
                placeholder="Address Line 1"
                value={customerDetails.shippingAddress1}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    shippingAddress1: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={customerDetails.shippingAddress2}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    shippingAddress2: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="City"
                value={customerDetails.shippingCity}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    shippingCity: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <CountryStateSearch
                onSelectCountry={handleSelectShippingCountry}
                onSelectState={handleSelectShippingState}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <br />
              <input
                type="text"
                placeholder="PIN Code"
                value={customerDetails.shippingZip}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    shippingZip: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <input
                type="text"
                value={customerDetails.paymentTerms}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    paymentTerms: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                value={customerDetails.gstNumber}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    gstNumber: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                GST Category
              </label>
              <input
                type="text"
                value={customerDetails.gstCategory}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    gstCategory: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                PAN
              </label>
              <input
                type="text"
                value={customerDetails.pan}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    pan: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Contact Person Name
              </label>
              <input
                type="text"
                value={customerDetails.contactPersonName}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    contactPersonName: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Commission Rate
              </label>
              <input
                type="text"
                value={customerDetails.commissionRate}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    commissionRate: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                GL Account
              </label>
              <input
                type="text"
                value={customerDetails.glAccount}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    glAccount: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        {/* </div> */}

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className={`px-6 py-3 text-white rounded-lg focus:outline-none ${
              isEditing ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {isEditing ? "Update Customer" : "Create Customer"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white rounded-lg px-6 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold text-blue-600 mt-12">Customer List</h2>
      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
       
          <div>
      <input
        type="text"
        placeholder="Search customers..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 border border-gray-300">Customer Code</th>
            <th className="px-4 py-2 border border-gray-300">Customer Name</th>
            <th className="px-4 py-2 border border-gray-300">Email</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.customerCode} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300">{customer.customerCode}</td>
              <td className="px-4 py-2 border border-gray-300">{customer.customerName}</td>
              <td className="px-4 py-2 border border-gray-300">{customer.emailId}</td>
              <td className="px-4 py-2 border border-gray-300 flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(customer)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(customer._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default CustomerManagement;

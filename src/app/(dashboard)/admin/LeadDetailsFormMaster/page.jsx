"use client"
// import React, { useState } from "react";

// const LeadDetailsForm = () => {
//   const [formData, setFormData] = useState({
//     salutation: "",
//     jobTitle: "",
//     leadOwner: "",
//     firstName: "",
//     gender: "",
//     status: "",
//     middleName: "",
//     source: "",
//     leadType: "",
//     lastName: "",
//     requestType: "",
//     email: "",
//     mobileNo: "",
//     phone: "",
//     website: "",
//     whatsapp: "",
//     phoneExt: "",
//     organizationName: "",
//     annualRevenue: "",
//     territory: "",
//     employees: "",
//     industry: "",
//     fax: "",
//     marketSegment: "",
//     city: "",
//     state: "",
//     county: "",
//     qualificationStatus: "",
//     qualifiedBy: "",
//     qualifiedOn: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.firstName) newErrors.firstName = "First name is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!formData.mobileNo) newErrors.mobileNo = "Mobile number is required";
//     if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
//       newErrors.mobileNo = "Mobile number must be 10 digits";
//     }

//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     console.log("Form submitted successfully", formData);
//     alert("Form submitted successfully!");
//     // Perform API call or other actions
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Lead Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="label">Salutation</label>
//           <input
//             name="salutation"
//             value={formData.salutation}
//             onChange={handleChange}
//             className={`input-field ${errors.salutation ? "border-red-500" : ""}`}
//             placeholder="Enter Salutation"
//           />
//           {errors.salutation && <p className="text-red-500 text-sm">{errors.salutation}</p>}
//         </div>
//         <div>
//           <label className="label">Job Title</label>
//           <input
//             name="jobTitle"
//             value={formData.jobTitle}
//             onChange={handleChange}
//             className={`input-field ${errors.jobTitle ? "border-red-500" : ""}`}
//             placeholder="Enter Job Title"
//           />
//           {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
//         </div>
//         <div>
//           <label className="label">Lead Owner</label>
//           <input
//             name="leadOwner"
//             value={formData.leadOwner}
//             onChange={handleChange}
//             className={`input-field ${errors.leadOwner ? "border-red-500" : ""}`}
//             placeholder="Enter Lead Owner"
//           />
//           {errors.leadOwner && <p className="text-red-500 text-sm">{errors.leadOwner}</p>}
//         </div>
//         <div>
//           <label className="label">First Name</label>
//           <input
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className={`input-field ${errors.firstName ? "border-red-500" : ""}`}
//             placeholder="Enter First Name"
//           />
//           {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
//         </div>
//       </div>

//       <h2 className="text-xl font-bold mt-6 mb-4">Contact Info</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="label">Email</label>
//           <input
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={`input-field ${errors.email ? "border-red-500" : ""}`}
//             placeholder="Enter Email"
//           />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//         </div>
//         <div>
//           <label className="label">Mobile No</label>
//           <input
//             name="mobileNo"
//             value={formData.mobileNo}
//             onChange={handleChange}
//             className={`input-field ${errors.mobileNo ? "border-red-500" : ""}`}
//             placeholder="Enter Mobile No"
//           />
//           {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
//         </div>
//       </div>

//       <div className="flex gap-4 mt-6">
//         <button
//           type="submit"
//           className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
//         >
//           Add
//         </button>
//         <button
//           type="button"
//           onClick={() => setFormData({})}
//           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LeadDetailsForm;

import React, { useState } from "react";

const LeadDetailsForm = () => {
  const [formData, setFormData] = useState({
    salutation: "",
    jobTitle: "",
    leadOwner: "",
    firstName: "",
    gender: "",
    status: "",
    middleName: "",
    source: "",
    leadType: "",
    lastName: "",
    requestType: "",
    email: "",
    mobileNo: "",
    phone: "",
    website: "",
    whatsapp: "",
    phoneExt: "",
    organizationName: "",
    annualRevenue: "",
    territory: "",
    employees: "",
    industry: "",
    fax: "",
    marketSegment: "",
    city: "",
    state: "",
    county: "",
    qualificationStatus: "",
    qualifiedBy: "",
    qualifiedOn: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile Number is required.";
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = "Mobile Number must be 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      alert("Form submitted successfully!");
      setFormData({
        salutation: "",
        jobTitle: "",
        leadOwner: "",
        firstName: "",
        gender: "",
        status: "",
        middleName: "",
        source: "",
        leadType: "",
        lastName: "",
        requestType: "",
        email: "",
        mobileNo: "",
        phone: "",
        website: "",
        whatsapp: "",
        phoneExt: "",
        organizationName: "",
        annualRevenue: "",
        territory: "",
        employees: "",
        industry: "",
        fax: "",
        marketSegment: "",
        city: "",
        state: "",
        county: "",
        qualificationStatus: "",
        qualifiedBy: "",
        qualifiedOn: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Lead Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example for one field */}
        {[
          { label: "Salutation", name: "salutation", type: "text" },
          { label: "Job Title", name: "jobTitle", type: "text" },
          { label: "Lead Owner", name: "leadOwner", type: "text" },
          { label: "First Name", name: "firstName", type: "text", required: true },
          { label: "Gender", name: "gender", type: "text" },
          { label: "Status", name: "status", type: "text" },
          { label: "Middle Name", name: "middleName", type: "text" },
          { label: "Source", name: "source", type: "text" },
          { label: "Lead Type", name: "leadType", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Request Type", name: "requestType", type: "text" },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Mobile No", name: "mobileNo", type: "text", required: true },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Website", name: "website", type: "url" },
          { label: "Whatsapp", name: "whatsapp", type: "text" },
          { label: "Phone Ext", name: "phoneExt", type: "text" },
          { label: "Organization Name", name: "organizationName", type: "text" },
          { label: "Annual Revenue", name: "annualRevenue", type: "number" },
          { label: "Territory", name: "territory", type: "text" },
          { label: "No. of Employees", name: "employees", type: "number" },
          { label: "Industry", name: "industry", type: "text" },
          { label: "Fax", name: "fax", type: "text" },
          { label: "Market Segment", name: "marketSegment", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "County", name: "county", type: "text" },
          { label: "Qualification Status", name: "qualificationStatus", type: "text" },
          { label: "Qualified By", name: "qualifiedBy", type: "text" },
          { label: "Qualified On", name: "qualifiedOn", type: "date" },
        ].map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="label block text-sm font-medium text-gray-700">{label}</label>
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
          onClick={() => setFormData({})}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LeadDetailsForm;


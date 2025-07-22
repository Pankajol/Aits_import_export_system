"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaCopy,
  FaEye,
  FaEnvelope,
  FaWhatsapp,
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function SalesQuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch Quotations with Authentication
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirect to login.");
        return;
      }

      const res = await axios.get("/api/sales-quotation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setQuotations(res.data.data);
      } else {
        console.error("Failed to fetch quotations:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ✅ Filtered list
  const filtered = useMemo(() => {
    if (!search.trim()) return quotations;
    return quotations.filter((q) =>
      (q.customerName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [quotations, search]);

  // ✅ Delete Quotation without Reload
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/sales-quotation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotations((prev) => prev.filter((q) => q._id !== id)); // ✅ Remove from state
    } catch {
      alert("Failed to delete quotation");
    }
  };

  // ✅ Copy to Order (no reload)
  const handleCopyTo = (quotation, dest) => {
    if (dest === "Order") {
      sessionStorage.setItem("salesOrderData", JSON.stringify(quotation));
      router.push("/admin/sales-order-view/new");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center dark:text-white">
        Sales Quotations new
      </h1>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1 relative max-w-sm">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by customer name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Link href="/admin/sales-quotation-view/new">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 shadow">
            <FaEdit className="mr-2" />
            Create New Quotation
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading…</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {["#", "Ref Number", "Customer", "Date", "Status", "Total", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, idx) => (
                  <tr key={q._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{q.refNumber}</td>
                    <td className="px-4 py-3">{q.customerName}</td>
                    <td className="px-4 py-3">{q.postingDate ? new Date(q.postingDate).toLocaleDateString("en-GB") : ""}</td>
                    <td className="px-4 py-3">{q.status}</td>
                    <td className="px-4 py-3">₹ {q.grandTotal}</td>
                    <td className="px-4 py-3">
                      <RowMenu quotation={q} onDelete={handleDelete} onCopy={handleCopyTo} />
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-gray-500 dark:text-gray-400">
                      No matching quotations.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filtered.map((q, idx) => (
              <div key={q._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-700 dark:text-gray-100">
                    #{idx + 1} • {q.refNumber}
                  </div>
                  <RowMenu quotation={q} onDelete={handleDelete} onCopy={handleCopyTo} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Customer:</strong> {q.customerName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Date:</strong> {q.postingDate ? new Date(q.postingDate).toLocaleDateString("en-GB") : ""}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Status:</strong> {q.status}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Total:</strong> ₹ {q.grandTotal}</div>
              </div>
            ))}
            {!filtered.length && <div className="text-center text-gray-500 dark:text-gray-400">No matching quotations.</div>}
          </div>
        </>
      )}
    </div>
  );
}

// ✅ RowMenu without Page Reload
function RowMenu({ quotation, onDelete, onCopy }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const MenuItem = ({ icon, label, onClick, color = "" }) => (
    <button
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600 transition-all"
    >
      <span className={color}>{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((p) => !p)}
        className="p-2 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full focus:ring-2 focus:ring-blue-500"
      >
        <FaEllipsisV size={18} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-[9999] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg animate-fadeIn"
            style={{
              position: "absolute",
              top: btnRef.current?.getBoundingClientRect().bottom + 8,
              left: btnRef.current?.getBoundingClientRect().left,
            }}
          >
            <MenuItem icon={<FaEye />} label="View" onClick={() => router.push(`/admin/sales-quotation-view/view/${quotation._id}`)} />
            <MenuItem icon={<FaEdit />} label="Edit" onClick={() => router.push(`/admin/sales-quotation-view/new?editId=${quotation._id}`)} />
            <MenuItem icon={<FaCopy />} label="Copy → Order" onClick={() => onCopy(quotation, "Order")} />
          <MenuItem
  icon={<FaEnvelope />}
  label="Email"
  onClick={async () => {
    try {
      const res = await axios.post("/api/email", {
        type: "quotation", // tells backend this is a sales quotation
        id: quotation._id, // pass the quotation ID
      });

      if (res.data.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error(res.data.message || "Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending email.");
    }
  }}
/>
            <MenuItem icon={<FaWhatsapp />} label="WhatsApp" onClick={() => router.push(`/admin/sales-quotation-whatsapp/${quotation._id}`)} />
            <MenuItem icon={<FaTrash />} label="Delete" color="text-red-600" onClick={() => onDelete(quotation._id)} />
          </div>,
          document.body
        )}
    </>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { FaEdit, FaTrash, FaCopy, FaEye } from "react-icons/fa";

// export default function SalesQuotationList() {
//   const [quotations, setQuotations] = useState([]);
//   const router = useRouter();

//   const fetchQuotations = async () => {
//     try {
//       const res = await axios.get("/api/sales-quotation");
//       if (res.data.success) {
//         setQuotations(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching quotations:", error);
//     }
//   };

//   useEffect(() => {
//     fetchQuotations();
//   }, []);


//   console.log(quotations)

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this quotation?")) return;
//     try {
//       const res = await axios.delete(`/api/sales-quotation/${id}`);
//       if (res.data.success) {
//         alert("Deleted successfully");
//         fetchQuotations();
//       }
//     } catch (error) {
//       console.error("Error deleting quotation:", error);
//       alert("Failed to delete quotation");
//     }
//   };
//   const handleCopyTo = (quotation, destination) => {
//     if (destination === "Order") {
//       // Use the correct key that matches your useEffect.
//       sessionStorage.setItem("salesOrderData", JSON.stringify(quotation));
//       router.push("/admin/sales-order");
//     }
//   };
  
//   // const handleCopyTo =  (quotation, destination) => {
//   //   // if (destination === "GRN") {
//   //   //   // Save using the key "grnData" so that the GRN page can read it.
//   //   //   sessionStorage.setItem("grnData", JSON.stringify(quotation));
//   //   //   router.push("/admin/GRN");
//   //   // } else if (destination === "Invoice") {
//   //   //   // sessionStorage.setItem("purchaseOrderData", JSON.stringify(quotation));
//   //   //   console.log("Copying quotation:", quotation);
//   //   //   sessionStorage.setItem("purchaseOrderData", JSON.stringify(quotation));

//   //   //   router.push("/admin/purchase-invoice");
//   //   // }else 
//   //   if (destination === "Order") {
      
//   //     sessionStorage.setItem("SalesOrderData", JSON.stringify(quotation));

//   //     // sessionStorage.setItem("purchaseOrderData", JSON.stringify(quotation));
//   //     router.push("/admin/sales-order");
//   //   }
//   //   // else if (destination === "Debit-Note") {
      
//   //   //   sessionStorage.setItem("debitNoteData", JSON.stringify(quotation));

//   //   //   // sessionStorage.setItem("purchaseOrderData", JSON.stringify(quotation));
//   //   //   router.push("/admin/debit-note");
//   //   // }
//   // };
//   const CopyToDropdown = ({ handleCopyTo, quotation }) => {
//     const [isOpen, setIsOpen] = useState(false);
  
//     const toggleDropdown = () => {
//       setIsOpen(prev => !prev);
//     };
  
//     const onSelect = (option) => {
//       handleCopyTo(quotation, option);
//       setIsOpen(false);
//     };
  
//     return (
//       <div className="relative inline-block text-left">
//         {/* Main button that toggles the dropdown */}
//         <button
//           onClick={toggleDropdown}
//           className="flex items-center px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-500 transition duration-200"
//           title="Copy To"
//         >
//           <FaCopy className="mr-1" />
//           <span className="hidden sm:inline"></span>
//         </button>
//         {/* Dropdown menu */}
//         {isOpen && (
//           <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
//             <div className="py-1">
            
//               <button
//                 onClick={() => onSelect("Order")}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Order
//               </button>
             
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-bold mb-6 text-center">
//         Sales Quotations
//       </h1>
//       <div className="flex justify-end mb-4">
//         <Link href="/admin/sales-quotation/new">
//           <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition duration-200">
//             <FaEdit className="mr-2" />
//             Create New Quotation
//           </button>
//         </Link>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-4 border-b">Ref Number</th>
//               <th className="py-3 px-4 border-b">Supplier Name</th>
//               <th className="py-3 px-4 border-b">Posting Date</th>
//               <th className="py-3 px-4 border-b">Status</th>
//               <th className="py-3 px-4 border-b">Grand Total</th>
//               <th className="py-3 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quotations.map((quotation) => (
//               <tr
//                 key={quotation._id}
//                 className="hover:bg-gray-50 transition-colors"
//               >
//                 <td className="py-3 px-4 border-b text-center">
//                   {quotation.refNumber}
//                 </td>
//                 <td className="py-3 px-4 border-b text-center">
//                   {quotation.customerName}
//                 </td>
//                 <td className="py-3 px-4 border-b text-center">
//                   {quotation.postingDate
//                     ? new Date(quotation.postingDate).toLocaleDateString()
//                     : ""}
//                 </td>
//                 <td className="py-3 px-4 border-b text-center">
//                   {quotation.status}
//                 </td>
//                 <td className="py-3 px-4 border-b text-center">
//                   {quotation.grandTotal}
//                 </td>
//                 <td className="py-3 px-4 border-b">
//                   <div className="flex justify-center space-x-2">
//                     {/* View Button */}
//                     <Link
//                       href={`/admin/sales-quotation-view/view/${quotation._id}`}
//                     >
//                       <button
//                         className="flex items-center px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition duration-200"
//                         title="View Details"
//                       >
//                         <FaEye />
//                       </button>
//                     </Link>
//                     {/* Edit Button (opens the form with editId) */}
//                     <Link
//                       href={`/admin/sales-quotation/new?editId=${quotation._id}`}
//                     >
//                       <button
//                         className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
//                         title="Edit"
//                       >
//                         <FaEdit />
//                       </button>
//                     </Link>
//                     {/* Delete Button */}
//                     <button
//                       onClick={() => handleDelete(quotation._id)}
//                       className="flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
//                       title="Delete"
//                     >
//                       <FaTrash />
//                     </button>
//                     {/* Copy To Buttons */}
//                     {/* <button
//                       onClick={() => handleCopyTo(quotation, "GRN")}
//                       className="flex items-center px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-500 transition duration-200"
//                       title="Copy To GRN"
//                     >
//                       <FaCopy className="mr-1" />
//                       <span className="hidden sm:inline">GRN</span>
//                     </button>
//                     <button
//                       onClick={() => handleCopyTo(quotation, "Invoice")}
//                       className="flex items-center px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-500 transition duration-200"
//                       title="Copy To Invoice"
//                     >
//                       <FaCopy className="mr-1" />
//                       <span className="hidden sm:inline">Invoice</span>
//                     </button> */}
//                     <CopyToDropdown handleCopyTo={handleCopyTo} quotation={quotation} />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {quotations.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-4">
//                   No purchase quotations found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

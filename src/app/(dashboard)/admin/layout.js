// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from 'next/navigation';
// import {jwtDecode} from 'jwt-decode';
// import LogoutButton from "@/components/LogoutButton";

// export default function AdminSidebar({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         router.push('/'); // Redirect to sign-in if no token
//     } else {
//       try {
//           const decodedToken = jwtDecode(token); // Decode token to get user info
//           setUser(decodedToken); // Set user data
//       } catch (error) {
//           console.error('Invalid token', error);
//           localStorage.removeItem('token');
//           // router.push('/dashboard'); // Redirect if token is invalid
//       }
//   }
// }, []);
//   const [openMenu, setOpenMenu] = useState(null);

//   const toggleMenu = (menuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

//   return (
//     <div className="min-h-screen flex">
//       <aside className="w-64 bg-gray-500 text-white p-4">
//         <h2 className="text-xl font-bold">Dashboard</h2>

//         <nav className="mt-4 space-y-2">
//           {/* Master Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Masters
//             </button>
//             {openMenu === "master" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/users"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   User
//                 </Link>
//                 <Link
//                   href="/admin/customer"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Customer
//                 </Link>
//                 <Link
//                   href="/admin/supplier"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Supplier
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Agent
//                 </Link>
//                 <Link
//                   href="/admin/item"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Item
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Location
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Warehouse
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Expense
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Freight
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Insurance
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Ledger
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Tax
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Multi-currency
//                 </Link>

//               </div>
//             )}
//           </div>
//           {/* Master View */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master-view")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Masters View
//             </button>
//             {openMenu === "master-view" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/users"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   User
//                 </Link>
//                  <Link
//                   href="/admin/customer-view"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Customer View
//                 </Link>
//               {/*  <Link
//                   href="/admin/supplier"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Supplier
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Agent
//                 </Link>
//                 <Link
//                   href="/admin/item"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Item
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Location
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Warehouse
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Expense
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Freight
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Insurance
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Ledger
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Tax
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   {" "}
//                   Multi-currency
//                 </Link> */}

//               </div>
//             )}
//           </div>

//           {/* Transaction Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("transaction")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Transactions
//             </button>
//             {openMenu === "transaction" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Sales order
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Delivery
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Invoice
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Credit Note
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Purchase Order
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Goods Receipt
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Invoice
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Debit Note
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Payment{" "}
//                 </Link>

//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Receipt
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Advance Booking
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Vessel booking
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Truck Booking
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Container Booking
//                 </Link>
//                 <Link
//                   href="/admin/#"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Customer / Supplier ledger
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* crm Dropdown */}
//           <div className="relative">
//           <button
//             onClick={() => toggleMenu("CRM")}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//           >
//             CRM
//           </button>
//           {openMenu === "CRM" && (
//             <div className="ml-4 mt-2 space-y-1">
//               <Link href="/admin/crm/#" className="block px-4 py-2 hover:bg-gray-700 rounded">
//               Lead generation
//               </Link>
//               <Link href="/admin/crm/#" className="block px-4 py-2 hover:bg-gray-700 rounded">
//               Opportunity
//               </Link>

//             </div>
//           )}
//         </div>
//         {/* calculater */}
//         <div className="relative">
//         <button
//             onClick={() => toggleMenu("Calculator")}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//           >
//             Calculator
//           </button>
//           {openMenu ==='Calculator' &&(
//              <div className="ml-4 mt-2 space-y-1">
//               <Link href="/admin/calculator" className="block px-4 py-2 hover:bg-gray-700 rounded">option1</Link>
//               <Link href="/admin/calculator" className="block px-4 py-2 hover:bg-gray-700 rounded">option1</Link>
//               </div>

//           )}

//         </div>
//         {/* function */}
//         <div className="relative">
//           <button
//             onClick={()=> toggleMenu("function")}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"

//           >
//             Functions
//           </button>
//           {openMenu === "function" && (
//             <div className="ml-4 mt-2 space-y-1">
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">User rights</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Supplier / customer / agent rights</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Transaction Alerts</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Approval</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Attachment – JPEG, Word, Document, video with real time attachment and date / time attachment</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Transaction Cancellation</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Transaction close</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Email configuration </Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">Face & thumb recognition</Link>
//               <Link href="/admin/function/#" className="block px-4 py-2 hover:bg-gray-700 rounded">User ID & Password</Link>

//             </div>
//           )}

//         </div>
//         </nav>
//         <LogoutButton />
//       </aside>
//       <main className="flex-1 bg-gray-100 p-8">{children}</main>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";
// import LogoutButton from "@/components/LogoutButton";

// export default function AdminSidebar({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [openMenu, setOpenMenu] = useState(null);
//   const [submenuOpen, setSubmenuOpen] = useState("");

//   // Token Validation and User Setup
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/"); // Redirect to sign-in if no token
//     } else {
//       try {
//         const decodedToken = jwtDecode(token); // Decode token to get user info
//         setUser(decodedToken); // Set user data
//       } catch (error) {
//         console.error("Invalid token", error);
//         localStorage.removeItem("token");
//         router.push("/"); // Redirect if token is invalid
//       }
//     }
//   }, [router]);

//   const toggleMenu = (menuName) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const toggleSubmenu = (menuName) => {
//     setSubmenuOpen(prev => (prev === menuName ? "" : menuName));
//   };

//   return (
//     <div className="min-h-screen flex">
//       <aside className="w-64 bg-gray-500 text-white p-4">
//         <h2 className="text-xl font-bold">Dashboard</h2>

//         <nav className="mt-4 space-y-2">
//           {/* Masters Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Masters
//             </button>
//             {openMenu === "master" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/users"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   User
//                 </Link>
//                 <Link
//                   href="/admin/createCustomers"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   CreateCustomer
//                 </Link>
//                 <Link
//                   href="/admin/Countries"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   Countries
//                 </Link>
//                 <Link
//                   href="/admin/State"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   State
//                 </Link>
//                 <Link
//                   href="/admin/City"
//                   className="block px-4 py-2 hover:bg-gray-700"
//                 >
//                   City
//                 </Link>
//                 <Link
//                   href="/admin/customers"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Customers
//                 </Link>
//                 <Link
//                   href="/admin/supplier"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Supplier
//                 </Link>
//                 <Link
//                   href="/admin/item"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Item
//                 </Link>
//                 <Link
//                   href="/admin/PaymentDetailsForm"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   PaymentDetailsForm
//                 </Link>
//                 <Link
//                   href="/admin/PaymentDetailsForm1"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   PaymentDetailsForm1
//                 </Link>
//                 <Link
//                   href="/admin/PurchaseReceiptForm"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   PurchaseReceiptForm
//                 </Link>
//                 <Link
//                   href="/admin/WarehouseDetailsForm"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   WarehouseDetailsForm
//                 </Link>
//                 <Link
//                   href="/admin/CreateGroup"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   CreateGroup
//                 </Link>
//                 <Link
//                   href="/admin/CreateItemGroup"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   CreateItmeGroup
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Masters-View Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master-view")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Masters-View
//             </button>
//             {openMenu === "master-view" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/users-view"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   User-View
//                 </Link>
//                 <Link
//                   href="/admin/customer-view"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Customers-View
//                 </Link>
//                 <Link
//                   href="/admin/supplier"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Supplier-View
//                 </Link>
//                 <Link
//                   href="/admin/item-view"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Item-View
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Transactions Menu */}

//           <div className="relative">
//             {/* Transactions Menu */}
//             <button
//               onClick={() => toggleMenu("transaction")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Transactions
//             </button>

//             {openMenu === "transaction" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 {/* Sales Submenu */}
//                 <button
//                   onClick={() => toggleMenu("sales")}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Sales
//                 </button>
//                 {submenuOpen === "sales" && (
//                   <div className="ml-4 mt-2 space-y-1">
//                     <Link
//                       href="/admin/sales-quotation"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Sales Quotation
//                     </Link>
//                     <Link
//                       href="/admin/sales-order"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Sales Order
//                     </Link>
//                     <Link
//                       href="/admin/delivery"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Delivery
//                     </Link>
//                     <Link
//                       href="/admin/AR-Invoice"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Invoice
//                     </Link>
//                     <Link
//                       href="/admin/credit-memo"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Credit Memo
//                     </Link>
//                   </div>
//                 )}

//                 {/* Purchase Submenu */}
//                 <button
//                   onClick={() => toggleMenu("purchase")}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Purchase
//                 </button>
//                 {submenuOpen === "purchase" && (
//                   <div className="ml-4 mt-2 space-y-1">
//                     <Link
//                       href="/admin/debit-note"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Debit Note
//                     </Link>
//                     <Link
//                       href="/admin/Payment"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Payment
//                     </Link>
//                     <Link
//                       href="/admin/GRN"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       GRN
//                     </Link>
//                     <Link
//                       href="/admin/purchase-invoice"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Purchase Invoice
//                     </Link>
//                     <Link
//                       href="/admin/purchase-order"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Purchase Order
//                     </Link>
//                     <Link
//                       href="/admin/purchase-quotation"
//                       className="block px-4 py-2 hover:bg-gray-700"
//                     >
//                       Purchase Quotation
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* CRM Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("CRM")}
//               className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               CRM
//             </button>
//             {openMenu === "CRM" && (
//               <div className="ml-4 mt-2 space-y-1">
//                 <Link
//                   href="/admin/LeadDetailsFormMaster"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Lead Generation
//                 </Link>
//                 <Link
//                   href="/admin/OpportunityDetailsForm"
//                   className="block px-4 py-2 hover:bg-gray-700 rounded"
//                 >
//                   Opportunity
//                 </Link>
//                 {/* <Link href="/admin/OpportunityDetailsForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
//                 OpportunityDetails
//                 </Link>
//                 <Link href="/admin/LeadDetailsFormMaster" className="block px-4 py-2 hover:bg-gray-700 rounded">
//                 LeadDetailsForm
//                 </Link> */}
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Logout Button */}
//         <div className="mt-4">
//           <LogoutButton />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-100 p-4">{children}</main>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "@/components/LogoutButton";

export default function AdminSidebar({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [submenuOpen, setSubmenuOpen] = useState("");

  // Token Validation and User Setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to sign-in if no token
    } else {
      try {
        const decodedToken = jwtDecode(token); // Decode token to get user info
        setUser(decodedToken); // Set user data
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        router.push("/"); // Redirect if token is invalid
      }
    }
  }, [router]);

  // Toggle main menus
  const toggleMenu = (menuName) => {
    // When closing a main menu, also clear any open submenu
    setOpenMenu((prev) => {
      if (prev === menuName) {
        setSubmenuOpen("");
        return null;
      }
      return menuName;
    });
  };

  // Toggle submenus (for Transactions menu)
  const toggleSubmenu = (menuName) => {
    setSubmenuOpen((prev) => (prev === menuName ? "" : menuName));
  };

  return (
    <div className="min-h-screen flex">
  {/* Fixed Sidebar */}
  <aside className="fixed w-64 h-full overflow-y-auto bg-gray-500 text-white p-4">
    <h2 className="text-xl font-bold">Dashboard</h2>
    <nav className="mt-4 space-y-2">
      {/* Masters Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("master")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Masters
        </button>
        {openMenu === "master" && (
          <div className="ml-4 mt-2 space-y-1 max-h-screen overflow-y-auto">
            <Link
              href="/admin/users"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              User
            </Link>
            <Link
              href="/admin/createCustomers"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              CreateCustomer
            </Link>
            <Link
              href="/admin/Countries"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Countries
            </Link>
            <Link
              href="/admin/State"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              State
            </Link>
            <Link
              href="/admin/City"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              City
            </Link>
            <Link
              href="/admin/customers"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Customers
            </Link>
            <Link
              href="/admin/supplier"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Supplier
            </Link>
            <Link
              href="/admin/item"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Item
            </Link>
            <Link
              href="/admin/PaymentDetailsForm"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              PaymentDetailsForm
            </Link>
            <Link
              href="/admin/PaymentDetailsForm1"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              PaymentDetailsForm1
            </Link>
            <Link
              href="/admin/PurchaseReceiptForm"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              PurchaseReceiptForm
            </Link>
            <Link
              href="/admin/WarehouseDetailsForm"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              WarehouseDetailsForm
            </Link>
            <Link
              href="/admin/CreateGroup"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              CreateGroup
            </Link>
            <Link
              href="/admin/CreateItemGroup"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              CreateItmeGroup
            </Link>
            <Link
              href="/admin/account-bankhead"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Account head deatails
            </Link>
            <Link
              href="/admin/bank-head-details"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Bank head deatails
            </Link>
          </div>
        )}
      </div>

      {/* Masters-View Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("master-view")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Masters-View
        </button>
        {openMenu === "master-view" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/users-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              User
            </Link>
            <Link
              href="/admin/customer-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Customers
            </Link>
            <Link
              href="/admin/supplier"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Supplier
            </Link>
            <Link
              href="/admin/item-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Item
            </Link>
            <Link
              href="/admin/account-head-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Account head
            </Link>
            <Link
              href="/admin/bank-head-details-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Bank head details
            </Link>
          </div>
        )}
      </div>

      {/* Transactions Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("transaction")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Transactions
        </button>
        {openMenu === "transaction" && (
          <div className="ml-4 mt-2 space-y-1">
            {/* Sales Submenu */}
            <button
              onClick={() => toggleSubmenu("sales")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Sales
            </button>
            {submenuOpen === "sales" && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/admin/sales-quotation"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Quotation
                </Link>
                <Link
                  href="/admin/sales-order"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                 Order
                </Link>
                <Link
                  href="/admin/delivery"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Delivery
                </Link>
                {/* <Link
                  href="/admin/AR-Invoice"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  AR-Invoice
                </Link> */}
                <Link
                  href="/admin/sales-invoice"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Invoice
                </Link>
                <Link
                  href="/admin/credit-memo"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Credit Note
                </Link>
              </div>
            )}

            {/* Purchase Submenu */}
            <button
              onClick={() => toggleSubmenu("purchase")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Purchase
            </button>
            {submenuOpen === "purchase" && (
              <div className="ml-4 mt-2 space-y-1">
                 <Link
                  href="/admin/purchase-quotation"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                   Quotation
                </Link>
                <Link
                  href="/admin/purchase-order"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Order
                </Link>
                
                <Link
                  href="/admin/GRN"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  GRN
                </Link>
                <Link
                  href="/admin/purchase-invoice"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Invoice
                </Link>
              
               
                <Link
                  href="/admin/debit-note"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Debit Note
                </Link>
                {/* <Link
                  href="/admin/Payment"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Payment
                </Link> */}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions View Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("transactions-view")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Transactions View
        </button>
        {openMenu === "transactions-view" && (
          <div className="ml-4 mt-2 space-y-1">
            {/* Sales Submenu */}
            <button
              onClick={() => toggleSubmenu("sales")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Sales
            </button>
            {submenuOpen === "sales" && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/admin/sales-quotation-view"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Quotation 
                </Link>
                <Link
                  href="/admin/sales-order-view"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Order
                </Link>
                <Link
                  href="/admin/delivery-view"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Delivery
                </Link>
                <Link
                  href="/admin/sales-invoice-view"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Invoice
                </Link>
                <Link
                  href="/admin/credit-memo-veiw"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Credit-note
                </Link>
              </div>
            )}

            {/* Purchase Submenu */}
            <button
              onClick={() => toggleSubmenu("purchase")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Purchase
            </button>
            {submenuOpen === "purchase" && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/admin/PurchaseQuotationList"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Quotation
                </Link>
                <Link
                  href="/admin/purchase-order-view"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Order
                </Link>
                <Link
                  href="/admin/grn-view"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  GRN
                </Link>
                <Link
                  href="/admin/purchaseInvoice-view"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Invoice
                </Link>
                <Link
                  href="/admin/debit-notes-view"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Debit-Note
                </Link>
              
              
              
              </div>
            )}
          </div>
        )}
      </div>

      {/* CRM Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("CRM")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          CRM
        </button>
        {openMenu === "CRM" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/LeadDetailsFormMaster"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Lead Generation
            </Link>
            <Link
              href="/admin/OpportunityDetailsForm"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Opportunity
            </Link>
         
          </div>
        )}
      </div>

      {/* Stock Menu */}
      <div className="relative">
        <button
          onClick={() => toggleMenu("Stock")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Stock
        </button>
        {openMenu === "Stock" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/InventoryView"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              View
            </Link>
          </div>
        )}
      </div>

       {/* payment Menu */}
       <div className="relative">
        <button
          onClick={() => toggleMenu("Payment")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Payment
        </button>
        {openMenu === "Payment" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/Payment"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Payment from
            </Link>
          </div>
        )}
      </div>


       {/* Production Menu */}
       <div className="relative">
        <button
          onClick={() => toggleMenu("Production")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Production
        </button>
        {openMenu === "Production" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/bom"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              BoM
            </Link>
            <Link
              href="/admin/ProductionOrder"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Production Order
            </Link>
            <Link
              href="/admin/issueForProduction"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Issue for Production
            </Link>
            <Link
              href="/admin/reciptFromProduction"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Receipt for Production
            </Link>
          </div>
        )}
      </div>



      
       {/* Production Menu */}
       <div className="relative">
        <button
          onClick={() => toggleMenu("Production-View")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
        >
          Production-View
        </button>
        {openMenu === "Production-View" && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/admin/bom"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              BoM-View
            </Link>
            <Link
              href="/admin/productionorders-list-view"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              Production Order View
            </Link>
            <Link
              href="/admin/issueForProduction"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
             all Issue for Production view
            </Link>
            <Link
              href="/admin/reciptFromProduction"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              all Receipt for Production view
            </Link>
          </div>
        )}
      </div>
    </nav>
    {/* Logout Button */}
    <div className="mt-4">
      <LogoutButton />
    </div>
  </aside>

  {/* Main Content Area with left margin to account for fixed sidebar */}
  <main className="flex-1 ml-64 bg-gray-100 p-12">
    {children}
  </main>
</div>



    // <div className="w-full">
    //   <div className="min-h-screen flex fixed">
    //     <aside className="w-64 bg-gray-500 text-white p-4">
    //       <h2 className="text-xl font-bold">Dashboard</h2>

    //       <nav className="mt-4 space-y-2  ">
    //         {/* Masters Menu */}
    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("master")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             Masters
    //           </button>
    //           {openMenu === "master" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               <Link
    //                 href="/admin/users"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 User
    //               </Link>
    //               <Link
    //                 href="/admin/createCustomers"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 CreateCustomer
    //               </Link>
    //               <Link
    //                 href="/admin/Countries"
    //                 className="block px-4 py-2 hover:bg-gray-700"
    //               >
    //                 Countries
    //               </Link>
    //               <Link
    //                 href="/admin/State"
    //                 className="block px-4 py-2 hover:bg-gray-700"
    //               >
    //                 State
    //               </Link>
    //               <Link
    //                 href="/admin/City"
    //                 className="block px-4 py-2 hover:bg-gray-700"
    //               >
    //                 City
    //               </Link>
    //               <Link
    //                 href="/admin/customers"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Customers
    //               </Link>
    //               <Link
    //                 href="/admin/supplier"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Supplier
    //               </Link>
    //               <Link
    //                 href="/admin/item"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Item
    //               </Link>
    //               <Link
    //                 href="/admin/PaymentDetailsForm"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 PaymentDetailsForm
    //               </Link>
    //               <Link
    //                 href="/admin/PaymentDetailsForm1"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 PaymentDetailsForm1
    //               </Link>
    //               <Link
    //                 href="/admin/PurchaseReceiptForm"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 PurchaseReceiptForm
    //               </Link>
    //               <Link
    //                 href="/admin/WarehouseDetailsForm"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 WarehouseDetailsForm
    //               </Link>
    //               <Link
    //                 href="/admin/CreateGroup"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 CreateGroup
    //               </Link>
    //               <Link
    //                 href="/admin/CreateItemGroup"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 CreateItmeGroup
    //               </Link>
    //             </div>
    //           )}
    //         </div>

    //         {/* Masters-View Menu */}
    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("master-view")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             Masters-View
    //           </button>
    //           {openMenu === "master-view" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               <Link
    //                 href="/admin/users-view"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 User-View
    //               </Link>
    //               <Link
    //                 href="/admin/customer-view"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Customers-View
    //               </Link>
    //               <Link
    //                 href="/admin/supplier"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Supplier-View
    //               </Link>
    //               <Link
    //                 href="/admin/item-view"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Item-View
    //               </Link>
    //             </div>
    //           )}
    //         </div>

    //         {/* Transactions Menu */}
    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("transaction")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             Transactions
    //           </button>

    //           {openMenu === "transaction" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               {/* Sales Submenu */}
    //               <button
    //                 onClick={() => toggleSubmenu("sales")}
    //                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Sales
    //               </button>
    //               {submenuOpen === "sales" && (
    //                 <div className="ml-4 mt-2 space-y-1">
    //                   <Link
    //                     href="/admin/sales-quotation"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Sales Quotation
    //                   </Link>
    //                   <Link
    //                     href="/admin/sales-order"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Sales Order
    //                   </Link>
    //                   <Link
    //                     href="/admin/delivery"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Delivery
    //                   </Link>
    //                   <Link
    //                     href="/admin/AR-Invoice"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     AR-Invoice
    //                   </Link>
    //                   <Link
    //                     href="/admin/sales-invoice"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Invoice
    //                   </Link>
    //                   <Link
    //                     href="/admin/credit-memo"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Credit Memo
    //                   </Link>
    //                 </div>
    //               )}

    //               {/* Purchase Submenu */}
    //               <button
    //                 onClick={() => toggleSubmenu("purchase")}
    //                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Purchase
    //               </button>
    //               {submenuOpen === "purchase" && (
    //                 <div className="ml-4 mt-2 space-y-1">
    //                   <Link
    //                     href="/admin/debit-note"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Debit Note
    //                   </Link>
    //                   <Link
    //                     href="/admin/Payment"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Payment
    //                   </Link>
    //                   <Link
    //                     href="/admin/GRN"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     GRN
    //                   </Link>
    //                   <Link
    //                     href="/admin/purchase-invoice"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Purchase Invoice
    //                   </Link>
    //                   <Link
    //                     href="/admin/purchase-order"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Purchase Order
    //                   </Link>
    //                   <Link
    //                     href="/admin/purchase-quotation"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Purchase Quotation
    //                   </Link>
    //                 </div>
    //               )}
    //             </div>
    //           )}
    //         </div>

    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("transactions-view")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             Transactions View
    //           </button>

    //           {openMenu === "transactions-view" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               {/* Sales Submenu */}
    //               <button
    //                 onClick={() => toggleSubmenu("sales")}
    //                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Sales
    //               </button>
    //               {submenuOpen === "sales" && (
    //                 <div className="ml-4 mt-2 space-y-1">
    //                   <Link
    //                     href="/admin/sales-quotation-view"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Sales Quotation view
    //                   </Link>
    //                   <Link
    //                     href="/admin/sales-order-view"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Sales Order
    //                   </Link>
    //                   <Link
    //                     href="/admin/delivery-view"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Delivery
    //                   </Link>
    //                   <Link
    //                     href="/admin/sales-invoice-view"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Invoice
    //                   </Link>
    //                   <Link
    //                     href="/admin/credit-memo-veiw"
    //                     className="block px-4 py-2 hover:bg-gray-700"
    //                   >
    //                     Credit Memo
    //                   </Link>
    //                 </div>
    //               )}

    //               {/* Purchase Submenu */}
    //               <button
    //                 onClick={() => toggleSubmenu("purchase")}
    //                 className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Purchase
    //               </button>
    //               {submenuOpen === "purchase" && (
    //                 <div className="ml-4 mt-2 space-y-1">
    //                   <Link
    //                     href="/admin/PurchaseQuotationList"
    //                     className="block px-4 py-2 hover:bg-gray-700 rounded"
    //                   >
    //                     Quotation
    //                   </Link>
    //                   <Link
    //                     href="/admin/debit-notes-view"
    //                     className="block px-4 py-2 hover:bg-gray-700 rounded"
    //                   >
    //                     Debit-Note
    //                   </Link>
    //                   <Link
    //                     href="/admin/purchase-order-view"
    //                     className="block px-4 py-2 hover:bg-gray-700 rounded"
    //                   >
    //                     Order
    //                   </Link>
    //                   <Link
    //                     href="/admin/grn-view"
    //                     className="block px-4 py-2 hover:bg-gray-700 rounded"
    //                   >
    //                     GRN
    //                   </Link>
    //                   <Link
    //                     href="/admin/purchaseInvoice-view"
    //                     className="block px-4 py-2 hover:bg-gray-700 rounded"
    //                   >
    //                     Invoice
    //                   </Link>
    //                 </div>
    //               )}
    //             </div>
    //           )}
    //         </div>

    //         {/* <div className="relative">
    //         <button
    //           onClick={() => toggleMenu("transactions-view")}
    //           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //         >
    //           Transactions View
    //         </button>
    //         {openMenu === "transactions-view" && (
    //           <div className="ml-4 mt-2 space-y-1">
    //                  <Link
    //               href="/admin/PurchaseQuotationList"
    //               className="block px-4 py-2 hover:bg-gray-700 rounded"
    //             >
    //               Quotation
    //             </Link>
    //             <Link
    //               href="/admin/debit-notes-view"
    //               className="block px-4 py-2 hover:bg-gray-700 rounded"
    //             >
    //               Debit-Note
    //             </Link>
    //             <Link
    //               href="/admin/purchase-order-view"
    //               className="block px-4 py-2 hover:bg-gray-700 rounded"
    //             >
    //               Order
    //             </Link>
    //             <Link
    //               href="/admin/grn-view"
    //               className="block px-4 py-2 hover:bg-gray-700 rounded"
    //             >
    //               GRN
    //             </Link>
    //             <Link
    //               href="/admin/purchaseInvoice-view"
    //               className="block px-4 py-2 hover:bg-gray-700 rounded"
    //             >
    //               Invoice
    //             </Link>
    //           </div>
    //         )}
    //       </div> */}
    //         {/* CRM Menu */}
    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("CRM")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             CRM
    //           </button>
    //           {openMenu === "CRM" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               <Link
    //                 href="/admin/LeadDetailsFormMaster"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Lead Generation
    //               </Link>
    //               <Link
    //                 href="/admin/OpportunityDetailsForm"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 Opportunity
    //               </Link>
    //               <Link
    //                 href="/admin/InventoryView"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 InventoryView
    //               </Link>
    //             </div>
    //           )}
    //         </div>

    //         {/* stcok */}
    //         <div className="relative">
    //           <button
    //             onClick={() => toggleMenu("Stock")}
    //             className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
    //           >
    //             Stock
    //           </button>
    //           {openMenu === "Stock" && (
    //             <div className="ml-4 mt-2 space-y-1">
    //               <Link
    //                 href="/admin/InventoryView"
    //                 className="block px-4 py-2 hover:bg-gray-700 rounded"
    //               >
    //                 InventoryView
    //               </Link>
    //             </div>
    //           )}
    //         </div>
    //       </nav>

    //       {/* Logout Button */}
    //       <div className="mt-4">
    //         <LogoutButton />
    //       </div>
    //     </aside>
    //   </div>
    //   {/* Main Content */}
   
    //     <main className="flex  justify-center bg-gray-100  p-12 ">{children}</main>
     
    // </div>
  );
}

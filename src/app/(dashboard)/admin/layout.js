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
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import LogoutButton from "@/components/LogoutButton";

export default function AdminSidebar({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

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

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-500 text-white p-4">
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
              <div className="ml-4 mt-2 space-y-1">
                <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  User
                </Link>
                <Link href="/admin/customers" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Customers
                </Link>
                <Link href="/admin/supplier" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Supplier
                </Link>
                <Link href="/admin/item" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Item
                </Link>
                <Link href="/admin/PaymentDetailsForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
                PaymentDetailsForm
                </Link>
                <Link href="/admin/PaymentDetailsForm1" className="block px-4 py-2 hover:bg-gray-700 rounded">
                PaymentDetailsForm1
                </Link>
                <Link href="/admin/PurchaseReceiptForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
                PurchaseReceiptForm
                </Link>
                <Link href="/admin/WarehouseDetailsForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
                WarehouseDetailsForm
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
                <Link href="/admin/users-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  User-View
                </Link>
                <Link href="/admin/customer-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Customers-View
                </Link>
                <Link href="/admin/supplier" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Supplier-View
                </Link>
                <Link href="/admin/item-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Item-View
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
                 <Link href="/admin/sales-quotation" className="block px-4 py-2 hover:bg-gray-700">
                  Sales-Quotation
                </Link>
                <Link href="/admin/sales-order" className="block px-4 py-2 hover:bg-gray-700">
                  Sales Order
                </Link>
                <Link href="/admin/delivery" className="block px-4 py-2 hover:bg-gray-700">
                  Delivery
                </Link>
                <Link href="/admin/AR-Invoice" className="block px-4 py-2 hover:bg-gray-700">
                  Invoice
                </Link>
                <Link href="/admin/credit-memo" className="block px-4 py-2 hover:bg-gray-700">
                  Credit Memo
                </Link>
                <Link href="/admin/debit-note" className="block px-4 py-2 hover:bg-gray-700">
                  Debits Note
                </Link>
                <Link href="/admin/Payment" className="block px-4 py-2 hover:bg-gray-700">
                  Payment
                </Link>
                <Link href="/admin/GRN" className="block px-4 py-2 hover:bg-gray-700">
                  GRN
                </Link>
                <Link href="/admin/purchase-invoice" className="block px-4 py-2 hover:bg-gray-700">
                  Purchase Invoice
                </Link>
                <Link href="/admin/purchase-order" className="block px-4 py-2 hover:bg-gray-700">
                  Purchase Order
                </Link>
                <Link href="/admin/purchase-quotation" className="block px-4 py-2 hover:bg-gray-700">
                  Purchase Quotation
                </Link>
                
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
                <Link href="/admin/LeadDetailsFormMaster" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Lead Generation
                </Link>
                <Link href="/admin/OpportunityDetailsForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
                  Opportunity
                </Link>
                {/* <Link href="/admin/OpportunityDetailsForm" className="block px-4 py-2 hover:bg-gray-700 rounded">
                OpportunityDetails
                </Link>
                <Link href="/admin/LeadDetailsFormMaster" className="block px-4 py-2 hover:bg-gray-700 rounded">
                LeadDetailsForm
                </Link> */}
              </div>

            )}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="mt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaCopy, FaEye } from "react-icons/fa";

export default function SalesOrderList() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/sales-order");
      console.log("Fetched orders:", res.data);
      // Expecting an object with a success flag and a data array.
    //   if (res.data.success) {
    //     setOrders(res.data);
    //   }
    setOrders(res.data);
    } catch (error) {
      console.error("Error fetching sales orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await axios.delete(`/api/sales-order/${id}`);
      if (res.data.success) {
        alert("Deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting sales order:", error);
      alert("Failed to delete order");
    }
  };

  const handleCopyTo = (order, destination) => {
    // sessionStorage.setItem("salesOrderData", JSON.stringify(order));
    //  router.push("/admin/sales-invoice");

    if (destination === "Delivery") {
      const orderWithId = { ...order, salesOrderId: order._id };
      sessionStorage.setItem("deliveryData", JSON.stringify(orderWithId));
      router.push("/admin/delivery");
    } else if (destination === "Invoice") {
      const invoiceWithId = {...order,sourceId:order._id,sourceModel: "SalesOrder"}
      sessionStorage.setItem("SalesInvoiceData", JSON.stringify(invoiceWithId));
      router.push("/admin/sales-invoice");
    } 
    // else if (destination === "Debit-Note") {
    //   sessionStorage.setItem("debitNoteData", JSON.stringify(order));
    //   router.push("/admin/debit-note");
    // }
  };

  const CopyToDropdown = ({ handleCopyTo, order }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const onSelect = (option) => {
      handleCopyTo(order, option);
      setIsOpen(false);
    };
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-500 transition duration-200"
          title="Copy To"
        >
          <FaCopy className="mr-1" />
          <span className="hidden sm:inline"></span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => onSelect("Delivery")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delivery
              </button>
              <button
                onClick={() => onSelect("Invoice")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Invoice
              </button>
            
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Sales Orders</h1>
      <div className="flex justify-end mb-4">
        <Link href="/admin/sales-order">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition duration-200">
            <FaEdit className="mr-2" />
            Create New Order
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Ref Number</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Posting Date</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Grand Total</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b text-center">{order.refNumber}</td>
                <td className="py-3 px-4 border-b text-center">{order.customerName}</td>
                <td className="py-3 px-4 border-b text-center">
                  {order.postingDate ? new Date(order.postingDate).toLocaleDateString() : ""}
                </td>
                <td className="py-3 px-4 border-b text-center">{order.status}</td>
                <td className="py-3 px-4 border-b text-center">{order.grandTotal}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex justify-center space-x-2">
                    {/* View Button */}
                    <Link href={`/admin/sales-order-view/${order._id}`}>
                      <button
                        className="flex items-center px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition duration-200"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </Link>
                    {/* Edit Button */}
                    <Link href={`/admin/sales-order-view/new?editId=${order._id}`}>
                      <button
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    {/* Copy To Dropdown */}
                    <CopyToDropdown handleCopyTo={handleCopyTo} order={order} />
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

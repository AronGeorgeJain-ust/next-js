"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Eye, Printer } from "lucide-react";
import { generateReceiptPdf } from "@/utils/receiptPdf";

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

export default function OrderPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    globalThis.window === undefined ? null : localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/order/list",
        {
          page: 0,
          sizePerPage: 100,
          sortField: "createdOn",
          sortDirection: "DESC",
        },
        { headers },
      );

      setOrders(res.data.dtoList ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (order) => {
    const res = await api.get(`/order/get?identifier=${order.identifier}`, {
      headers,
    });

    const fullOrder = res.data;

    const doc = generateReceiptPdf(fullOrder);

    doc.save(`Receipt-${fullOrder.identifier}.pdf`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  let tableContent;

  if (loading) {
    tableContent = (
      <tr>
        <td colSpan={7} className="text-center py-8 text-gray-500">
          Loading...
        </td>
      </tr>
    );
  } else if (orders.length === 0) {
    tableContent = (
      <tr>
        <td colSpan={7} className="text-center py-8 text-gray-500">
          No orders found
        </td>
      </tr>
    );
  } else {
    tableContent = orders.map((order) => (
      <tr
        key={order.identifier}
        className="border-b border-gray-100 hover:bg-gray-50"
      >
        <td className="px-4 py-3 font-medium">{order.identifier}</td>

        <td className="px-4 py-3">{order.customer}</td>

        <td className="px-4 py-3 text-right">
          {currency(order.originalPrice)}
        </td>

        <td className="px-4 py-3 text-right text-green-600">
          {currency(order.discount)}
        </td>

        <td className="px-4 py-3 text-right font-semibold">
          {currency(order.totalPrice)}
        </td>

        <td className="px-4 py-3 text-center">{order.paymentMethod}</td>

        <td className="px-4 py-3">
          <div className="flex justify-center gap-2">
            <button
              onClick={() =>
                router.push(`/order/view?identifier=${order.identifier}`)
              }
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
              title="View Order"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => downloadReceipt(order)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
              title="Download Receipt"
            >
              <Printer size={16} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

          <button
            onClick={() => router.push("/cart")}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            New Order
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-right">Original</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Payment</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

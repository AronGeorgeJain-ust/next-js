"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { generateReceiptPdf } from "@/utils/receiptPdf";
import PropTypes from "prop-types";
import api from "@/services/api";

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

export default function OrderViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const identifier = searchParams.get("identifier");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!identifier) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/order/get?identifier=${identifier}`, {
          headers,
        });

        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [identifier]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p>Order not found.</p>
      </div>
    );
  }

  const previewReceipt = () => {
    const doc = generateReceiptPdf(order);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const downloadReceipt = () => {
    const doc = generateReceiptPdf(order);

    doc.save(`Receipt-${order.identifier}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push("/order")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </button>

            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={previewReceipt}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
            >
              Preview
            </button>

            <button
              onClick={downloadReceipt}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              <Printer size={18} />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Order Information
            </h2>

            <div className="space-y-2 text-sm">
              <InfoRow label="Order ID" value={order.identifier} />
              <InfoRow label="Customer" value={order.customer} />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Payment Details
            </h2>

            <div className="space-y-2 text-sm">
              <InfoRow
                label="Original Price"
                value={currency(order.originalPrice)}
              />

              <InfoRow label="Discount" value={currency(order.discount)} />

              <InfoRow label="Total Price" value={currency(order.totalPrice)} />

              <InfoRow
                label="Received Amount"
                value={currency(order.receivedAmount)}
              />

              <InfoRow
                label="Change Amount"
                value={currency(order.changeAmount)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Order Items</h2>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">MRP</th>
                <th className="px-4 py-3 text-right">Discount</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.entryList?.length > 0 ? (
                order.entryList.map((entry) => (
                  <tr
                    key={entry.identifier}
                    className="border-b border-gray-100"
                  >
                    <td className="px-4 py-3">{entry.product}</td>

                    <td className="px-4 py-3 text-right">
                      {currency(entry.mrp)}
                    </td>

                    <td className="px-4 py-3 text-right text-green-600">
                      {currency(entry.unitDiscount)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {currency(entry.unitPrice)}
                    </td>

                    <td className="px-4 py-3 text-center">{entry.quantity}</td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {currency(entry.totalPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-80 bg-white rounded-2xl border border-gray-200 p-5">
            <div className="space-y-2">
              <InfoRow
                label="Original Price"
                value={currency(order.originalPrice)}
              />

              <InfoRow label="Discount" value={currency(order.discount)} />

              <div className="border-t pt-3 mt-3">
                <InfoRow
                  label="Grand Total"
                  value={currency(order.totalPrice)}
                  bold
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>

      <span className={bold ? "font-bold text-gray-900" : "text-gray-900"}>
        {value}
      </span>
    </div>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bold: PropTypes.bool,
};

InfoRow.defaultProps = {
  bold: false,
};

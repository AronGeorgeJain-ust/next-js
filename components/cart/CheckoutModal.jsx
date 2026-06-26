import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { fmt } from "@/utils/currency";
import api from "@/services/api";

const CheckoutModal = ({
  isOpen,
  onClose,
  customer,
  cart,
  headers,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [receivedAmount, setReceivedAmount] = useState("");

  const total = Number(cart?.totalPrice || 0);

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod("CASH");
      setReceivedAmount(total.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleReceivedAmountChange = (e) => {
    setReceivedAmount(e.target.value);
  };

  const change = useMemo(() => {
    if (paymentMethod !== "CASH") return 0;
    const parsed = Number.parseFloat(receivedAmount);
    const safeReceived = Number.isFinite(parsed) ? parsed : 0;
    return Math.max(0, safeReceived - total);
  }, [paymentMethod, receivedAmount, total]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      const payload = {
        customer,
        paymentMethod,
      };

      if (paymentMethod === "CASH") {
        payload.receivedAmount = Number(receivedAmount);
      }

      const res = await api.post("/order/checkout", payload, { headers });

      if (res.data.success) {
        onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <div className="space-y-3">
          <div>
            <label htmlFor="paymentMethod" className="font-medium">
              Payment Method
            </label>

            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-1 border rounded-lg p-2"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>
          </div>

          {paymentMethod === "CASH" && (
            <>
              <div>
                <label htmlFor="receivedAmount" className="font-medium">
                  Received Amount
                </label>

                <input
                  id="receivedAmount"
                  type="number"
                  value={receivedAmount ?? ""}
                  onChange={handleReceivedAmountChange}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Change</span>
                  <span>{fmt(change)}</span>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-3">
            <button onClick={onClose} className="flex-1 border rounded-xl py-2">
              Cancel
            </button>

            <button
              onClick={handleCheckout}
              className="flex-1 bg-red-600 text-white rounded-xl py-2"
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customer: PropTypes.string,
  cart: PropTypes.object,
  headers: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CheckoutModal;

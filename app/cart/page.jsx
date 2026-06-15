"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import api from "@/services/api";
import PropTypes from "prop-types";

import SearchableDropdown from "@/components/dropdown/SearchableDropdown";

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-GB").replaceAll("/", "-");
};

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const CustomerField = ({ value, onChange, customers }) => (
  <div className="border border-gray-300 rounded-lg px-4 pt-2 pb-2">
    <p className="text-xs text-gray-500 mb-1">Customer</p>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
    >
      <option value="">Select Customer</option>

      {customers.map((customer) => (
        <option key={customer.identifier} value={customer.identifier}>
          {customer.name ?? customer.identifier}
        </option>
      ))}
    </select>
  </div>
);

const CartTable = ({ entries, onQtyChange, onRemove }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          {[
            "Items",
            "Code",
            "Sale Price",
            "Qty",
            "Sub Total",
            "Action",
          ].map((h) => (
            <th
              key={h}
              className="px-4 py-3 text-left font-semibold text-gray-700"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
              No items added yet. Select a product above to begin.
            </td>
          </tr>
        ) : (
          entries.map((entry, i) => (
            <tr
              key={entry.identifier ?? i}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {entry.product}
              </td>
              <td className="px-4 py-3 text-gray-500">{entry.identifier}</td>
              <td className="px-4 py-3 text-gray-700">
                {currency(entry.unitPrice)}
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={1}
                  value={entry.quantity}
                  onChange={(e) => onQtyChange(i, e.target.value)}
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                {currency(entry.totalPrice)}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onRemove(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const CartTotals = ({ cart }) => (
  <div className="flex justify-end mt-6">
    <div className="w-72 space-y-2 text-sm">
      <Row label="Original Price" value={currency(cart?.totalOriginalPrice)} />
      <Row
        label="Discount"
        value={`- ${currency(cart?.totalDiscount)}`}
        green
      />
      <div className="border-t border-gray-200 pt-2">
        <Row label="Total Payable" value={currency(cart?.totalPrice)} bold />
      </div>
    </div>
  </div>
);

const Row = ({ label, value, green, bold }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span
      className={`${green ? "text-green-600" : "text-gray-900"} ${bold ? "font-bold text-base" : ""}`}
    >
      {value}
    </span>
  </div>
);

const CartPage = () => {
  const router = useRouter();
  const token = globalThis.localStorage?.getItem("token");

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [cartData, setCartData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    api
      .post("/product/list", { page: 0, sizePerPage: 500 }, { headers })
      .then((res) => setProducts(res.data.dtoList ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    api
      .post("/customer/list", { page: 0, sizePerPage: 500 }, { headers })
      .then((res) => setCustomers(res.data.dtoList ?? []))
      .catch(console.error);
  }, []);

  const fetchCart = async (customerId) => {
    if (!customerId) {
      setCartData(null);
      setEntries([]);
      return;
    }

    try {
      const cartRes = await api.get(`/cart/get?identifier=${customerId}`, {
        headers,
      });

      setCartData(cartRes.data);

      const entriesRes = await api.post(
        "/cartentry/list",
        { page: 0, sizePerPage: 500 },
        { headers },
      );

      const allEntries = entriesRes.data ?? [];

      const customerEntries = allEntries.filter(
        (entry) => entry.cart === customerId,
      );

      setEntries(customerEntries);
    } catch (err) {
      console.error(err);
      setCartData(null);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchCart(customer);
  }, [customer]);

  const handleAddProduct = async () => {
    if (!customer) {
      showMessage("Please select a customer");
      return;
    }

    if (!selectedProduct) {
      showMessage("Please select a product");
      return;
    }
    setSaving(true);
    try {
      console.log("Selected Customer:", customer);
      console.log("Payload:", {
        product: selectedProduct,
        cart: customer,
        quantity: 1,
      });
      await api.post(
        "/cartentry/add",
        { product: selectedProduct, cart: customer, quantity: quantity },
        { headers },
      );
      setSelectedProduct("");
      setQuantity(1);
      await fetchCart(customer);
      showMessage("Item added");
    } catch {
      showMessage("Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleQtyChange = async (index, qty) => {
    const entry = entries[index];
    if (!qty || Number(qty) < 1) return;
    try {
      await api.post(
        "/cartentry/update",
        { ...entry, quantity: Number(qty) },
        { headers },
      );
      await fetchCart(customer);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (index) => {
    const entry = entries[index];
    try {
      api.get(`/cartentry/delete?identifier=${entry.identifier}`, { headers });
      await fetchCart(customer);
      showMessage("Item removed");
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={22} className="text-red-600" />
          <h1 className="text-xl font-bold text-gray-900">Cart</h1>
        </div>

        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg px-6 py-3 rounded-xl text-sm text-gray-700 z-50">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <SearchableDropdown
            items={customers}
            value={customer}
            onChange={setCustomer}
            placeholder="Search customer..."
            getLabel={(c) => `${c.name} (${c.identifier})`}
            getValue={(c) => c.identifier}
          />

          <div className="border border-gray-300 rounded-lg px-4 pt-2 pb-2">
            <p className="text-xs text-gray-500 mb-1">Customer ID</p>
            <p className="font-medium text-gray-900">{customer || "—"}</p>
          </div>

          <div className="border border-gray-300 rounded-lg px-4 pt-2 pb-2 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="font-medium text-gray-500">{today()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 items-end">
          <div className="sm:col-span-2 flex items-end gap-3">
            <div className="flex-1">
              <SearchableDropdown
                items={products}
                value={selectedProduct}
                onChange={(value) => {
                  setSelectedProduct(value);
                  setQuantity(1);
                }}
                placeholder="Search product..."
                getLabel={(p) => p.name}
                getValue={(p) => p.identifier}
              />
            </div>

            <div className="w-24">
              <input
                type="number"
                min="1"
                value={quantity}
                disabled={!selectedProduct}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="Qty"
              />
            </div>

            <button
              onClick={handleAddProduct}
              disabled={!selectedProduct || saving}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 shrink-0"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <CartTable
          entries={entries}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
        />

        <CartTotals cart={cartData} />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => router.push("/home")}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={() => showMessage("Cart saved")}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
          >
            Save Cart
          </button>
        </div>
      </div>
    </div>
  );
};

CustomerField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
};

CartTable.propTypes = {
  entries: PropTypes.array.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

CartTotals.propTypes = {
  cart: PropTypes.shape({
    totalOriginalPrice: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    totalDiscount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    totalPrice: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
};

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  green: PropTypes.bool,
  bold: PropTypes.bool,
};

export default CartPage;

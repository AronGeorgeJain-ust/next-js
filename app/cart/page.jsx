"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, UserPlus } from "lucide-react";
import api from "@/services/api";
import SearchableDropdown from "@/components/dropdown/SearchableDropdown";
import CheckoutModal from "@/components/cart/CheckoutModal";
import AddCustomerModal from "@/components/cart/AddCustomerModal";
import ProductGrid from "@/components/cart/ProductGrid";
import CartTable from "@/components/cart/CartTable";
import BillingPanel from "@/components/cart/BillingPanel";

const CartPage = () => {
  const router = useRouter();
  const token = globalThis.localStorage?.getItem("token");

  const [customer, setCustomer] = useState("");
  const [customerObj, setCustomerObj] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [addingProduct, setAddingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchCart = async (customerId) => {
    if (!customerId) {
      setCartData(null);
      setEntries([]);
      return;
    }
    try {
      const [cartRes, entriesRes] = await Promise.all([
        api.get(`/cart/get?identifier=${customerId}`, { headers }),
        api.post("/cartentry/list", { page: 0, sizePerPage: 500 }, { headers }),
      ]);
      setCartData(cartRes.data);
      const all = entriesRes.data ?? [];
      setEntries(all.filter((e) => e.cart === customerId));
    } catch {
      setCartData(null);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchCart(customer);
  }, [customer]);

  const handleProductAdd = async (product) => {
    const productIdentifier = product?.identifier ?? product;

    if (!customer) {
      showMessage("Please select a customer first");
      return;
    }

    if (
      product &&
      typeof product === "object" &&
      Number(product.stockQuantity ?? 0) <= 0
    ) {
      showMessage("Product is out of stock");
      return;
    }

    setAddingProduct(productIdentifier);
    try {
      await api.post(
        "/cartentry/add",
        { product: productIdentifier, cart: customer, quantity: 1 },
        { headers },
      );
      await fetchCart(customer);
      showMessage("Item added");
    } catch {
      showMessage("Failed to add item");
    } finally {
      setAddingProduct(null);
    }
  };

  const handleQtyChange = async (index, qty) => {
    const entry = entries[index];
    if (!qty || Number(qty) < 1) return;
    try {
      await api.put(
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
      await api.delete(`/cartentry/delete?identifier=${entry.identifier}`, {
        headers,
      });
      await fetchCart(customer);
      showMessage("Item removed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    if (!customer) return;
    if (!globalThis.confirm("Clear this cart?")) return;
    try {
      await api.delete(`/cart/delete?identifier=${customer}`, { headers });
      setCartData(null);
      setEntries([]);
      showMessage("Cart cleared");
    } catch {
      showMessage("Failed to clear cart");
    }
  };

  const handleCustomerSaved = (newCustomer) => {
    setCustomer(newCustomer.identifier ?? newCustomer.phoneNo);
    setCustomerObj(newCustomer);
    showMessage("Customer added");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingCart size={20} className="text-red-600" />
          <h1 className="text-xl font-bold text-gray-900">Cart</h1>
        </div>

        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg px-6 py-3 rounded-xl text-sm text-gray-700">
            {message}
          </div>
        )}

        <AddCustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          onSaved={handleCustomerSaved}
          headers={headers}
        />

        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          customer={customer}
          cart={cartData}
          headers={headers}
          onSuccess={(order) => {
            setCheckoutOpen(false);

            showMessage(order.message);

            setCartData(null);
            setEntries([]);

            router.push(`/order/view?identifier=${order.identifier}`);
          }}
        />

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "minmax(0,7fr) minmax(0,3fr)" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <SearchableDropdown
                  searchEndpoint="/customer/search"
                  searchParam="query"
                  value={customer}
                  onChange={(val, item) => {
                    setCustomer(val);
                    setCustomerObj(item ?? null);
                  }}
                  placeholder="Search customer..."
                  getLabel={(c) => `${c.name} (${c.identifier})`}
                  getValue={(c) => c.identifier}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl px-6 py-2 flex flex-col justify-center min-w-[140px] shrink-0">
                <p className="text-xs text-gray-400 leading-none mb-1">
                  Customer ID
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-none truncate">
                  {customer || "—"}
                </p>
              </div>

              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-3 px-6 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shrink-0"
              >
                <UserPlus size={16} />
                New
              </button>
            </div>

            <ProductGrid
              onAdd={handleProductAdd}
              addingProduct={addingProduct}
              headers={headers}
            />

            <CartTable
              entries={entries}
              onQtyChange={handleQtyChange}
              onRemove={handleRemove}
            />
          </div>

          <div
            className="sticky top-6"
            style={{ height: "calc(100vh - 7rem)" }}
          >
            <BillingPanel
              cart={cartData}
              entries={entries}
              customer={customer}
              customerObj={customerObj}
              onClearCart={handleClearCart}
              onSave={() => setCheckoutOpen(true)}
              router={router}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import ModelList from "@/components/common/ModelList";
import CustomerEdit from "./Edit/page";
import api from "@/services/api";

const AddressModal = ({ label, address, onClose }) => {
  if (!address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <div className="space-y-1 text-sm text-gray-800">
          <p>{address.addressLine}</p>
          <p>
            {[address.city, address.state, address.zip]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>{address.country}</p>
          {address.phoneNo && (
            <p className="mt-2 text-gray-500">📞 {address.phoneNo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

AddressModal.propTypes = {
  label: PropTypes.string,
  address: PropTypes.shape({
    addressLine: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    country: PropTypes.string,
    phoneNo: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

const CustomerList = () => {
  const [modal, setModal] = useState({ label: "", address: null });
  const [loadingKey, setLoadingKey] = useState(null); // "billing-PHONE" | "shipping-PHONE"

  const handleView = async (item, type) => {
    const phoneNo = item.phoneNo;
    const key = `${type}-${phoneNo}`;
    setLoadingKey(key);
    try {
      const token = globalThis.localStorage?.getItem("token");
      const res = await api.get(
        `/address/get?phoneNo=${phoneNo}&addressType=${type}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setModal({
        label: type === "billing" ? "Billing Address" : "Shipping Address",
        address: res.data,
      });
    } catch (err) {
      console.error("Failed to fetch address", err);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      <ModelList
        keys={[
          "id",
          "name",
          "phoneNo",
          "email",
          "partyType",
          "balance",
          "balanceType",
          "creditLimit",
        ]}
        modelName="customer"
        EditComponent={CustomerEdit}
        extraColumns={[
          {
            header: "Billing Address",
            render: (item) => {
              const isLoading = loadingKey === `billing-${item.phoneNo}`;
              return (
                <button
                  onClick={() => handleView(item, "billing")}
                  disabled={isLoading}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                >
                  {isLoading ? "Loading…" : "View"}
                </button>
              );
            },
          },
          {
            header: "Shipping Address",
            render: (item) => {
              const isLoading = loadingKey === `shipping-${item.phoneNo}`;
              return (
                <button
                  onClick={() => handleView(item, "shipping")}
                  disabled={isLoading}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                >
                  {isLoading ? "Loading…" : "View"}
                </button>
              );
            },
          },
        ]}
      />

      <AddressModal
        label={modal.label}
        address={modal.address}
        onClose={() => setModal({ label: "", address: null })}
      />
    </>
  );
};

export default CustomerList;

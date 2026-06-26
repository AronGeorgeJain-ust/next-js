"use client";

import PropTypes from "prop-types";

export const customerBaseFields = [
  { name: "name", type: "text", label: "Customer Name" },
  { name: "phoneNo", type: "text", label: "Phone Number" },
  { name: "email", type: "text", label: "Email" },
  { name: "creditLimit", type: "number", label: "Credit Limit" },
];

export const customerEditableFields = customerBaseFields.map(
  (field) => field.name,
);

export const customerInitialData = {
  name: "",
  phoneNo: "",
  email: "",
  creditLimit: "",
  partyType: "",
  balance: "",
  balanceType: "Due",
  billingAddress: {
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
  shippingAddress: {
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  },
};

export const customerValidationFields = [
  ...customerEditableFields,
  "partyType",
  "balance",
  "balanceType",
  "billingAddress",
  "shippingAddress",
];

const AddressInput = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block mb-1 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

AddressInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

const CustomerForm = ({ formData = {}, handleChange, errors = {} }) => {
  const billingAddress = formData.billingAddress || {};
  const shippingAddress = formData.shippingAddress || {};

  const handleAddressChange = (prefix, address, e) => {
    const { name, value } = e.target;

    handleChange({
      target: {
        name: prefix,
        value: {
          ...address,
          [name]: value,
        },
      },
    });
  };

  return (
    <>
      ={" "}
      <div className="w-full">
        <label
          htmlFor="partyType"
          className="block mb-2 text-sm font-semibold text-gray-700"
        >
          Party Type
        </label>

        <select
          id="partyType"
          name="partyType"
          value={formData.partyType || ""}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select one</option>
          <option value="Customer">Customer</option>
          <option value="Dealer">Dealer</option>
          <option value="Wholesaler">Wholesaler</option>
        </select>

        {errors.partyType && (
          <p className="mt-2 text-sm text-red-500">{errors.partyType}</p>
        )}
      </div>
      <div className="w-full">
        <label
          htmlFor="balance"
          className="block mb-2 text-sm font-semibold text-gray-700"
        >
          Balance
        </label>

        <div className="flex gap-2">
          <input
            id="balance"
            type="number"
            name="balance"
            value={formData.balance || ""}
            onChange={handleChange}
            placeholder="Ex: 500"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="balanceType"
            value={formData.balanceType || "Due"}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Due">Due</option>
            <option value="Advance">Advance</option>
          </select>
        </div>

        {errors.balance && (
          <p className="mt-2 text-sm text-red-500">{errors.balance}</p>
        )}
      </div>
      <div className="w-full">
        <p className="mb-3 text-sm font-bold text-red-500">— Billing Address</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AddressInput
            label="Address Line"
            name="addressLine"
            value={billingAddress.addressLine}
            onChange={(e) =>
              handleAddressChange("billingAddress", billingAddress, e)
            }
            placeholder="Enter address"
          />

          <AddressInput
            label="City"
            name="city"
            value={billingAddress.city}
            onChange={(e) =>
              handleAddressChange("billingAddress", billingAddress, e)
            }
            placeholder="Enter city"
          />

          <AddressInput
            label="State"
            name="state"
            value={billingAddress.state}
            onChange={(e) =>
              handleAddressChange("billingAddress", billingAddress, e)
            }
            placeholder="Enter state"
          />

          <AddressInput
            label="Zip Code"
            name="zip"
            value={billingAddress.zip}
            onChange={(e) =>
              handleAddressChange("billingAddress", billingAddress, e)
            }
            placeholder="Enter zip code"
          />

          <AddressInput
            label="Country"
            name="country"
            value={billingAddress.country}
            onChange={(e) =>
              handleAddressChange("billingAddress", billingAddress, e)
            }
            placeholder="Enter country"
          />
        </div>
      </div>
      <div className="w-full">
        <p className="mb-3 text-sm font-bold text-red-500">
          — Shipping Address
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AddressInput
            label="Address Line"
            name="addressLine"
            value={shippingAddress.addressLine}
            onChange={(e) =>
              handleAddressChange("shippingAddress", shippingAddress, e)
            }
            placeholder="Enter address"
          />

          <AddressInput
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={(e) =>
              handleAddressChange("shippingAddress", shippingAddress, e)
            }
            placeholder="Enter city"
          />

          <AddressInput
            label="State"
            name="state"
            value={shippingAddress.state}
            onChange={(e) =>
              handleAddressChange("shippingAddress", shippingAddress, e)
            }
            placeholder="Enter state"
          />

          <AddressInput
            label="Zip Code"
            name="zip"
            value={shippingAddress.zip}
            onChange={(e) =>
              handleAddressChange("shippingAddress", shippingAddress, e)
            }
            placeholder="Enter zip code"
          />

          <AddressInput
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={(e) =>
              handleAddressChange("shippingAddress", shippingAddress, e)
            }
            placeholder="Enter country"
          />
        </div>
      </div>
    </>
  );
};

CustomerForm.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

export default CustomerForm;

"use client";

import PropTypes from "prop-types";
import AddPage from "@/components/common/AddPage";
import Dropdown from "@/components/dropdown/Dropdown";

const PriceTypeField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label htmlFor="priceType" className="block mb-2 text-sm font-semibold text-gray-700">
      Price Type
    </label>
    <select
      id="priceType"
      name="priceType"
      value={formData.priceType || ""}
      onChange={handleChange}
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Price Type</option>
      <option value="Mrp">MRP</option>
      <option value="Selling">Selling Price</option>
    </select>
    {errors.priceType && (
      <p className="mt-2 text-sm text-red-500">{errors.priceType}</p>
    )}
  </div>
);

PriceTypeField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const PriceValueField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label htmlFor="priceValue" className="block mb-2 text-sm font-semibold text-gray-700">
      Value
    </label>
    <input
      id="priceValue"
      type="number"
      name="value"
      value={formData.value || ""}
      onChange={handleChange}
      placeholder="Enter value"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.value && (
      <p className="mt-2 text-sm text-red-500">{errors.value}</p>
    )}
  </div>
);

PriceValueField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const PriceAdd = () => {
  const fields = [];

  const initialData = {
    productName: "",
    priceType: "",
    value: "",
  };

  const modelName = "price";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    >

      <Dropdown
        name="productName"
        label="Product"
        placeholder="Select Product"
        endpoint="/product/list"
        optionValue={(item) => item.identifier}
        optionLabel={(item) => item.name}
      />
      <PriceTypeField />
      <PriceValueField />
    </AddPage>
  );
};

export default PriceAdd;
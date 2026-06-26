"use client";

import PropTypes from "prop-types";
import AddPage from "@/components/common/AddPage";
import Dropdown from "@/components/dropdown/Dropdown";

const StockQuantityField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label
      htmlFor="quantity"
      className="block mb-2 text-sm font-semibold text-gray-700"
    >
      Quantity
    </label>
    <input
      id="quantity"
      type="number"
      name="quantity"
      value={formData.quantity || ""}
      onChange={handleChange}
      placeholder="Enter quantity"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.quantity && (
      <p className="mt-2 text-sm text-red-500">{errors.quantity}</p>
    )}
  </div>
);

StockQuantityField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const StockReorderLevelField = ({
  formData = {},
  handleChange,
  errors = {},
}) => (
  <div className="w-full">
    <label
      htmlFor="reorderLevel"
      className="block mb-2 text-sm font-semibold text-gray-700"
    >
      Reorder Level
    </label>
    <input
      id="reorderLevel"
      type="number"
      name="reorderLevel"
      value={formData.reorderLevel || ""}
      onChange={handleChange}
      placeholder="Enter reorder level"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.reorderLevel && (
      <p className="mt-2 text-sm text-red-500">{errors.reorderLevel}</p>
    )}
  </div>
);

StockReorderLevelField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const StockWarehouseField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label
      htmlFor="warehouse"
      className="block mb-2 text-sm font-semibold text-gray-700"
    >
      Warehouse
    </label>
    <input
      id="warehouse"
      type="text"
      name="warehouse"
      value={formData.warehouse || ""}
      onChange={handleChange}
      placeholder="Enter warehouse"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.warehouse && (
      <p className="mt-2 text-sm text-red-500">{errors.warehouse}</p>
    )}
  </div>
);

StockWarehouseField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const StockRackField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label
      htmlFor="rack"
      className="block mb-2 text-sm font-semibold text-gray-700"
    >
      Rack
    </label>
    <input
      id="rack"
      type="text"
      name="rack"
      value={formData.rack || ""}
      onChange={handleChange}
      placeholder="Enter rack"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.rack && <p className="mt-2 text-sm text-red-500">{errors.rack}</p>}
  </div>
);

StockRackField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const StockShelfField = ({ formData = {}, handleChange, errors = {} }) => (
  <div className="w-full">
    <label
      htmlFor="shelf"
      className="block mb-2 text-sm font-semibold text-gray-700"
    >
      Shelf
    </label>
    <input
      id="shelf"
      type="text"
      name="shelf"
      value={formData.shelf || ""}
      onChange={handleChange}
      placeholder="Enter shelf"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.shelf && (
      <p className="mt-2 text-sm text-red-500">{errors.shelf}</p>
    )}
  </div>
);

StockShelfField.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
};

const StockAdd = () => {
  const fields = [];

  const initialData = {
    product: "",
    quantity: "",
    reorderLevel: "",
    warehouse: "",
  };

  const modelName = "stock";

  return (
    <AddPage modelName={modelName} fields={fields} initialData={initialData}>
      <Dropdown
        name="product"
        label="Product"
        placeholder="Select Product"
        endpoint="/product/list"
        optionValue={(item) => item.identifier}
        optionLabel={(item) => item.name}
      />
      <StockQuantityField />
      <StockReorderLevelField />
      <Dropdown
        name="warehouse"
        label="Warehouse"
        placeholder="Select Warehouse"
        endpoint="/warehouse/list"
        optionValue={(item) => item.identifier}
        optionLabel={(item) => item.identifier}
      />
    </AddPage>
  );
};

export default StockAdd;

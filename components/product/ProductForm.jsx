"use client";

import PropTypes from "prop-types";

import Dropdown from "@/components/dropdown/Dropdown";

export const productBaseFields = [
  {
    name: "identifier",
    type: "text",
    label: "Identifier",
  },
  {
    name: "name",
    type: "text",
    label: "Name",
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
  },
];

export const productEditableFields = productBaseFields.map(
  (field) => field.name,
);

export const productInitialData = {
  identifier: "",
  name: "",
  description: "",
  brandName: "",
  model: "",
  category: [],
  unit: "",
};

export const productValidationFields = [
  ...productEditableFields,
  "brandName",
  "category",
  "model",
  "unit",
];

const ProductForm = ({ formData, handleChange, errors }) => (
  <>
    <Dropdown
      name="brandName"
      label="Brand"
      placeholder="Select Brand"
      endpoint="/brand/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.name}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />

    <Dropdown
      name="model"
      label="Model"
      placeholder="Select Model"
      endpoint="/model/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.identifier}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />

    <Dropdown
      name="category"
      label="Category"
      placeholder="Select Category"
      endpoint="/category/list"
      multiple
      optionValue={(item) => item.name}
      optionLabel={(item) => item.name}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />

    <Dropdown
      name="unit"
      label="Unit"
      placeholder="Select Unit"
      endpoint="/unit/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.identifier}
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />
  </>
);

ProductForm.propTypes = {
  formData: PropTypes.shape({
    identifier: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    brandName: PropTypes.string,
    model: PropTypes.string,
    category: PropTypes.arrayOf(PropTypes.string),
    unit: PropTypes.string,
  }),
  handleChange: PropTypes.func,
  errors: PropTypes.shape({
    identifier: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    brandName: PropTypes.string,
    model: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
  }),
};

export default ProductForm;

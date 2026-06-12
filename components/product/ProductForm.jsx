"use client";

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

export const productEditableFields = productBaseFields.map((field) => field.name);

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

const ProductForm = () => (
  <>
    <Dropdown
      name="brandName"
      label="Brand"
      placeholder="Select Brand"
      endpoint="/brand/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.name}
    />

    <Dropdown
      name="model"
      label="Model"
      placeholder="Select Model"
      endpoint="/model/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.identifier}
    />

    <Dropdown
      name="category"
      label="Category"
      placeholder="Select Category"
      endpoint="/category/list"
      multiple
      optionValue={(item) => item.name}
      optionLabel={(item) => item.name}
    />

    <Dropdown
      name="unit"
      label="Unit"
      placeholder="Select Unit"
      endpoint="/unit/list"
      optionValue={(item) => item.identifier}
      optionLabel={(item) => item.identifier}
    />
  </>
);

export default ProductForm;

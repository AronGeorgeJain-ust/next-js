"use client";

import AddPage from "@/components/common/AddPage";
import Dropdown from "@/components/dropdown/Dropdown";

const CategoryAdd = () => {

  const fields = [
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

  const initialData = {
    identifier: "",
    name: "",
    description: "",
    superCategory: "",
  };

  const modelName = "category";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    >
      <Dropdown
        name="superCategory"
        label="Super Category"
        placeholder="Select Super Category"
        endpoint="/category/list"
        optionValue={(item) => item.name}
        optionLabel={(item) => item.name}
        filterOptions={(categories, formData) =>
          categories.filter(
            (category) =>
              ![formData.name, formData.identifier].includes(category.name) &&
              ![formData.name, formData.identifier].includes(category.identifier)
          )
        }
        normalizeValue={(value) => (value === "" ? null : value)}
      />

    </AddPage>
  );
};

export default CategoryAdd;
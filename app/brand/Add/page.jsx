"use client";

import AddPage from "@/components/common/AddPage";

const BrandAdd = () => {
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
  };

  const modelName = "brand";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default BrandAdd;

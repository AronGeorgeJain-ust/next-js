"use client";

import AddPage from "@/components/common/AddPage";

const ModelsAdd = () => {
  const fields = [
    {
      name: "identifier",
      type: "text",
      label: "Identifier",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
  ];

  const initialData = {
    identifier: "",
    description: "",
  };

  return (
    <AddPage
      modelName="model"
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default ModelsAdd;

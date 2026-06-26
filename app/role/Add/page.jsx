"use client";

import AddPage from "@/components/common/AddPage";

const RoleAdd = () => {
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

  const modelName = "role";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default RoleAdd;

"use client";

import AddPage from "@/components/common/AddPage";

const RackAdd = () => {
  const fields = [
    {
      name: "identifier",
      type: "text",
      label: "Identifier",
    },
  ];

  const initialData = {
    identifier: "",
  };

  return (
    <AddPage
      modelName="rack"
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default RackAdd;

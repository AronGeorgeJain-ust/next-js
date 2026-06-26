"use client";

import AddPage from "@/components/common/AddPage";

const UnitAdd = () => {
  const fields = [
    {
      name: "identifier",
      type: "text",
      label: "Identifier",
    },
  ];

  const initialData = {
    identifier: "",
    path: "",
    roles: [],
  };

  return (
    <AddPage
      modelName="unit"
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default UnitAdd;

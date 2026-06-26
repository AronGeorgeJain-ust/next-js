"use client";

import AddPage from "@/components/common/AddPage";

const ShelfAdd = () => {
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
      modelName="shelf"
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default ShelfAdd;

"use client";

import AddPage from "@/components/common/AddPage";

const WarehouseAdd = () => {
  const fields = [
    {
      name: "identifier",
      type: "text",
      label: "Identifier",
    },
    {
      name: "contactName",
      type: "text",
      label: "Contact Name",
    },
    {
      name: "contactNumber",
      type: "text",
      label: "Contact Number",
    },
    {
      name: "location",
      type: "text",
      label: "Location",
    },
    {
      name: "region",
      type: "text",
      label: "Region",
    },
    {
      name: "country",
      type: "text",
      label: "Country",
    },
  ];

  const initialData = {
    identifier: "",
    contactName: "",
    contactNumber: "",
    location: "",
    region: "",
    country: "",
  };

  const modelName = "warehouse";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    ></AddPage>
  );
};

export default WarehouseAdd;

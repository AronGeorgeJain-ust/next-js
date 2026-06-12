"use client";

import AddPage from "@/components/common/AddPage";

import Dropdown from "@/components/dropdown/Dropdown";

const NodeAdd = () => {

  const fields = [
    {
      name: "identifier",
      type: "text",
      label: "Identifier",
    },
    {
      name: "path",
      type: "text",
      label: "Path",
    },
  ];

  const initialData = {
    identifier: "",
    path: "",
    roles: [],
  };

  const modelName = "node";

  return (
    <AddPage
      modelName={modelName}
      fields={fields}
      initialData={initialData}
    >
      <Dropdown
        name="roles"
        label="Role"
        placeholder="Select Roles"
        endpoint="/role/list"
        multiple
        optionValue={(item) => item?.identifier ?? item?.name ?? item}
        optionLabel={(item) => item?.name ?? item?.identifier ?? item}
      />
    </AddPage>
  );
};

export default NodeAdd;
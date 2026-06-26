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

  return (
    <AddPage modelName="node" fields={fields} initialData={initialData}>
      <Dropdown
        name="roles"
        label="Roles"
        placeholder="Select Roles"
        endpoint="/role/list"
        method="post"
        requestBody={{ page: 0, sizePerPage: 100 }}
        multiple
        optionValue={(item) => item?.identifier ?? item?.name ?? String(item)}
        optionLabel={(item) => item?.name ?? item?.identifier ?? String(item)}
      />
    </AddPage>
  );
};

export default NodeAdd;

"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import Dropdown from "@/components/dropdown/Dropdown";
import EditModal from "@/components/common/EditModal";

const NodeEdit = ({
  isOpen,
  onClose,
  item,
  onUpdateSuccess,
}) => {
  const editableFields = ["identifier", "path"];

  return (
    <EntityEdit
      title="Edit Node"
      endpoint="/node/update"
      validationFields={[...editableFields, "roles"]}
      redirectTo="/node"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />

      <Dropdown
        name="roles"
        label="Role"
        placeholder="Select Roles"
        endpoint="/role/list"
        multiple
        optionValue={(item) => item?.identifier ?? item?.name ?? item}
        optionLabel={(item) => item?.name ?? item?.identifier ?? item}
      />
    </EntityEdit>
  );
};

NodeEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default NodeEdit;
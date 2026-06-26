"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const RoleEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier", "description"];

  return (
    <EntityEdit
      title="Edit Role"
      endpoint="/role/update"
      validationFields={editableFields}
      redirectTo="/role"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

RoleEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifier: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default RoleEdit;

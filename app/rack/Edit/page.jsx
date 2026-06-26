"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const RackEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier"];

  return (
    <EntityEdit
      title="Edit Rack"
      endpoint="/rack/update"
      validationFields={[...editableFields]}
      redirectTo="/rack"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

RackEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default RackEdit;

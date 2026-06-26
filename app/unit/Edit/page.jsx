"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const UnitEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier"];

  return (
    <EntityEdit
      title="Edit Unit"
      endpoint="/unit/update"
      validationFields={[...editableFields]}
      redirectTo="/unit"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

UnitEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default UnitEdit;

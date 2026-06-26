"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const ShelfEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier"];

  return (
    <EntityEdit
      title="Edit Shelf"
      endpoint="/shelf/update"
      validationFields={[...editableFields]}
      redirectTo="/shelf"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

ShelfEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default ShelfEdit;

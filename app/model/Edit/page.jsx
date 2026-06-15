"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const ModelsEdit = ({
  isOpen,
  onClose,
  item,
  onUpdateSuccess,
}) => {
  const editableFields = ["identifier", "description"];

  return (
    <EntityEdit
      title="Edit Models"
      endpoint="/models/update"
      validationFields={[...editableFields]}
      redirectTo="/models"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

ModelsEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default ModelsEdit;
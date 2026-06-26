"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const BrandEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier", "description"];

  return (
    <EntityEdit
      title="Edit Brand"
      endpoint="/brand/update"
      validationFields={editableFields}
      redirectTo="/brand"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

BrandEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifier: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default BrandEdit;

"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

const WarehouseEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = [
    "identifier",
    "contactName",
    "contactNumber",
    "location",
    "region",
    "country",
  ];

  return (
    <EntityEdit
      title="Edit Warehouse"
      endpoint="/warehouse/update"
      validationFields={editableFields}
      redirectTo="/warehouse"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

WarehouseEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifier: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default WarehouseEdit;

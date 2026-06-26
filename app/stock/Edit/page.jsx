"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";
import Dropdown from "@/components/dropdown/Dropdown";

const StockEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["quantity", "reorderLevel", "warehouse"];

  return (
    <EntityEdit
      title="Edit Stock"
      endpoint="/stock/update"
      validationFields={[...editableFields, "product"]}
      redirectTo="/stock"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />

      <Dropdown
        name="product"
        label="Product"
        placeholder="Select Product"
        endpoint="/product/list"
        optionValue={(item) => item.identifier}
        optionLabel={(item) => item.name}
      />
    </EntityEdit>
  );
};

StockEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default StockEdit;

"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";
import Dropdown from "@/components/dropdown/Dropdown";

const PriceEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["priceType", "value"];

  return (
    <EntityEdit
      title="Edit Price"
      endpoint="/price/update"
      validationFields={[...editableFields, "product"]}
      redirectTo="/price"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <Dropdown
        name="product"
        label="Product"
        placeholder="Select Product"
        endpoint="/product/list"
        disabled={true}
        optionValue={(item) => item.identifier}
        optionLabel={(item) => item.name}
      />

      <EditModal editableFields={editableFields} />
    </EntityEdit>
  );
};

PriceEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default PriceEdit;

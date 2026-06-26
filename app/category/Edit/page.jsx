"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import Dropdown from "@/components/dropdown/Dropdown";
import EditModal from "@/components/common/EditModal";

const CategoryEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => {
  const editableFields = ["identifier", "description"];

  return (
    <EntityEdit
      title="Edit Category"
      endpoint="/category/update"
      validationFields={[...editableFields, "superCategory"]}
      redirectTo="/category"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={editableFields} />

      <Dropdown
        name="superCategory"
        label="Super Category"
        placeholder="Select Super Category"
        endpoint="/category/list"
        optionValue={(item) => item.name}
        optionLabel={(item) => item.name}
        filterOptions={(categories, formData) =>
          categories.filter(
            (category) =>
              ![formData?.name, formData?.identifier].includes(category.name) &&
              ![formData?.name, formData?.identifier].includes(
                category.identifier,
              ),
          )
        }
        normalizeValue={(value) => (value === "" ? null : value)}
      />
    </EntityEdit>
  );
};

CategoryEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default CategoryEdit;

"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";
import ProductForm, {
  productEditableFields,
  productValidationFields,
} from "@/components/product/ProductForm";

const ProductEdit = ({
  isOpen,
  onClose,
  item,
  onUpdateSuccess,
}) => {
  return (
    <EntityEdit
      title="Edit Product"
      endpoint="/product/update"
      validationFields={productValidationFields}
      redirectTo="/product"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    >
      <EditModal editableFields={productEditableFields} />
      <ProductForm />
    </EntityEdit>
  );
};

ProductEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  item: PropTypes.shape({
    identifier: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    brandName: PropTypes.string,
    model: PropTypes.string,
    category: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    unit: PropTypes.string,
  }),
};

ProductEdit.defaultProps = {
  item: {},
};

export default ProductEdit;
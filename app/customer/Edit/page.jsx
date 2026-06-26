"use client";

import PropTypes from "prop-types";

import EntityEdit from "@/components/common/EntityEdit";
import EditModal from "@/components/common/EditModal";

import CustomerForm, {
  customerEditableFields,
  customerValidationFields,
} from "@/components/customer/CustomerForm";

const CustomerEdit = ({ isOpen, onClose, item, onUpdateSuccess }) => (
  <EntityEdit
    title="Edit Customer"
    endpoint="/customer/update"
    validationFields={customerValidationFields}
    redirectTo="/customer"
    item={item}
    isOpen={isOpen}
    onClose={onClose}
    onUpdateSuccess={onUpdateSuccess}
  >
    <EditModal editableFields={customerEditableFields} />
    <CustomerForm />
  </EntityEdit>
);

CustomerEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
};

export default CustomerEdit;

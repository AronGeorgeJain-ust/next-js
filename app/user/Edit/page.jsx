"use client";

import PropTypes from "prop-types";
import EntityEdit from "@/components/common/EntityEdit";
import Dropdown from "@/components/dropdown/Dropdown";
import EditModal from "@/components/common/EditModal";

const transformUserItem = (item) => {
  let roles = [];
  if (Array.isArray(item.roles)) {
    roles = item.roles.map(
      (role) => role?.identifier || role?.name || role
    );
  } else if (item.roles) {
    roles = [
      item.roles?.identifier || item.roles?.name || item.roles,
    ];
  }
  return {
    ...item,
    roles,
  };
};

const UserEdit = ({
  isOpen,
  onClose,
  item,
  onUpdateSuccess,
}) => {
  const editableFields = ["name", "username", "phoneNo"];

  return (
    <EntityEdit
      title="Edit User"
      endpoint="/user/update"
      validationFields={[...editableFields, "roles"]}
      redirectTo="/user"
      item={item}
      isOpen={isOpen}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
      transformItem={transformUserItem}
    >
      <EditModal editableFields={editableFields} />

      {/* eslint-disable-next-line react/prop-types */}
      <Dropdown
        name="roles"
        label="Role"
        placeholder="Select Roles"
        endpoint="/role/list"
        multiple
        // eslint-disable-next-line react/prop-types
        optionValue={(item) => item?.identifier ?? item?.name ?? item}
        // eslint-disable-next-line react/prop-types
        optionLabel={(item) => item?.name ?? item?.identifier ?? item}
      />
    </EntityEdit>
  );
};

UserEdit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    phoneNo: PropTypes.string,
    roles: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            identifier: PropTypes.string,
            name: PropTypes.string,
          }),
        ])
      ),
      PropTypes.object,
      PropTypes.string,
    ]),
  }).isRequired,
};

export default UserEdit;

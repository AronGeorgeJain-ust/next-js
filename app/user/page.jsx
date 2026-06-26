import ModelList from "@/components/common/ModelList";
import UserEdit from "./Edit/page";

const UserList = () => (
  <ModelList
    keys={["id", "name", "username", "phoneNo", "roles"]}
    modelName="user"
    EditComponent={UserEdit}
  />
);

export default UserList;

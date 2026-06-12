import ModelList from "@/components/common/ModelList";
import RoleEdit from "./Edit/page";

const RoleList = () => (
  <ModelList
    keys={["id", "identifier", "description", "status"]}
    modelName="role"
    EditComponent={RoleEdit}
  />
);

export default RoleList;
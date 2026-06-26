import ModelList from "@/components/common/ModelList";
import RackEdit from "./Edit/page";

const RackList = () => (
  <ModelList
    keys={["id", "identifier", "status"]}
    modelName="rack"
    EditComponent={RackEdit}
  />
);

export default RackList;

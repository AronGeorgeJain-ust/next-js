import ModelList from "@/components/common/ModelList";
import NodeEdit from "./Edit/page";

const NodeList = () => (
  <ModelList
    keys={["id", "identifier", "path", "roles", "status"]}
    modelName="node"
    EditComponent={NodeEdit}
  />
);

export default NodeList;
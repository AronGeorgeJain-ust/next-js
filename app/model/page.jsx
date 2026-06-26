import ModelList from "@/components/common/ModelList";
import ModelsEdit from "./Edit/page";

const ModelsList = () => (
  <ModelList
    keys={["id", "identifier", "description", "status"]}
    modelName="model"
    EditComponent={ModelsEdit}
  />
);

export default ModelsList;

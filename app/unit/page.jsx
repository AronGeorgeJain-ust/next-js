import ModelList from "@/components/common/ModelList";
import UnitEdit from "./Edit/page";

const UnitList = () => (
  <ModelList
    keys={["id", "identifier", "status"]}
    modelName="unit"
    EditComponent={UnitEdit}
  />
);

export default UnitList;

import ModelList from "@/components/common/ModelList";
import ShelfEdit from "./Edit/page";

const ShelfList = () => (
  <ModelList
    keys={["id", "identifier", "status"]}
    modelName="shelf"
    EditComponent={ShelfEdit}
  />
);

export default ShelfList;

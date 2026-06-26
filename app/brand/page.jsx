import ModelList from "@/components/common/ModelList";
import BrandEdit from "./Edit/page";

const BrandList = () => (
  <ModelList
    keys={["id", "identifier", "name", "description", "status"]}
    modelName="brand"
    EditComponent={BrandEdit}
  />
);

export default BrandList;

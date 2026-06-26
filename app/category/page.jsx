import ModelList from "@/components/common/ModelList";
import CategoryEdit from "./Edit/page";

const CategoryList = () => (
  <ModelList
    keys={[
      "id",
      "identifier",
      "name",
      "superCategory",
      "description",
      "status",
    ]}
    modelName="category"
    EditComponent={CategoryEdit}
  />
);

export default CategoryList;

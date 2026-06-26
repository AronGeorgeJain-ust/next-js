import ModelList from "@/components/common/ModelList";
import WarehouseEdit from "./Edit/page";

const WarehouseList = () => (
  <ModelList
    keys={[
      "id",
      "identifier",
      "contactName",
      "contactNumber",
      "region",
      "country",
      "status",
    ]}
    modelName="warehouse"
    EditComponent={WarehouseEdit}
  />
);

export default WarehouseList;

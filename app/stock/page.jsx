import ModelList from "@/components/common/ModelList";
import StockEdit from "./Edit/page";

const StockList = () => (
  <ModelList
    keys={["id", "product", "quantity", "reorderLevel", "warehouse"]}
    modelName="stock"
    EditComponent={StockEdit}
  />
);

export default StockList;

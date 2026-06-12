import ModelList from "@/components/common/ModelList";
import PriceEdit from "./Edit/page";

const PriceList = () => (
  <ModelList
    keys={["id", "product", "priceType", "value"]}
    modelName="price"
    EditComponent={PriceEdit}
  />
);

export default PriceList;
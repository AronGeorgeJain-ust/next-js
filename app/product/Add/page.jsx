"use client";

import AddPage from "@/components/common/AddPage";
import ProductForm, {
  productBaseFields,
  productInitialData,
} from "@/components/product/ProductForm";

const ProductAdd = () => {
  const modelName = "product";

  return (
    <AddPage
      modelName={modelName}
      fields={productBaseFields}
      initialData={productInitialData}
    >
      <ProductForm />
    </AddPage>
  );
};

export default ProductAdd;

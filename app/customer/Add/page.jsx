"use client";

import AddPage from "@/components/common/AddPage";

import CustomerForm, {
  customerBaseFields,
  customerInitialData,
} from "@/components/customer/CustomerForm";

const CustomerAdd = () => (
  <AddPage
    modelName="customer"
    fields={customerBaseFields}
    initialData={customerInitialData}
  >
    <CustomerForm />
  </AddPage>
);

export default CustomerAdd;

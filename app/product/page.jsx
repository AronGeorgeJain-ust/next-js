"use client";

import { useState } from "react";

import ListPage from "@/components/common/ListPage";
import api from "@/services/api";
import ProductEdit from "./Edit/page";

const ProductList = () => {
  const keys = [
    "id",
    "identifier",
    "name",
    "brandName",
    "category",
    "unit",
    "description",
    "status",
  ];
  const modelName = "product";

  const token =
    globalThis.window === undefined ? null : localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listUpdateHandler, setListUpdateHandler] = useState(null);

  const handleEdit = async (identifier) => {
    try {
      const res = await api.get(`/${modelName}/get?identifier=${identifier}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedItem(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSuccess = (updatedItem) => {
    listUpdateHandler?.(updatedItem);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ListPage
        keys={keys}
        modelName={modelName}
        onEdit={handleEdit}
        setListUpdateHandler={setListUpdateHandler}
      />

      <ProductEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ProductList;

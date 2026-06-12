"use client";

import { useState } from "react";

import ListPage from "@/components/common/ListPage";
import api from "@/services/api";
import CategoryEdit from "./Edit/page";

const CategoryList = () => {
  const keys = ["id", "identifier", "name", "superCategory", "description", "status"];
  const modelName = "category";

  let token = null;

  if (globalThis.localStorage) {
    token = globalThis.localStorage.getItem("token");
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listUpdateHandler, setListUpdateHandler] = useState(null);

  const handleEdit = async (identifier) => {
    try {
      const res = await api.get(
        `/${modelName}/get?identifier=${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      <CategoryEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default CategoryList;

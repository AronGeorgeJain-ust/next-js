"use client";

import { useState } from "react";

import ListPage from "@/components/common/ListPage";
import api from "@/services/api";
import RoleEdit from "./Edit/page";

const RoleList = () => {
  const keys = ["id", "identifier", "description", "status"];
  const modelName = "role";

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

      <RoleEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default RoleList;

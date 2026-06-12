"use client";

import { useState } from "react";

import ListPage from "@/components/common/ListPage";
import api from "@/services/api";
import NodeEdit from "./Edit/page";

const NodeList = () => {
  const keys = ["id", "identifier", "path", "roles", "status"];
  const modelName = "node";

  const token = globalThis?.window ? localStorage.getItem("token") : null;

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

      <NodeEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default NodeList;

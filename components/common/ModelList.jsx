"use client";

import { useState } from "react";
import PropTypes from "prop-types";

import ListPage from "@/components/common/ListPage";
import api from "@/services/api";

const ModelList = ({ keys, modelName, EditComponent, extraColumns }) => {
  const token =
    globalThis.window === undefined ? null : localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listUpdateHandler, setListUpdateHandler] = useState(null);

  const handleEdit = async (identifier) => {
    try {
      const res = await api.get(`/${modelName}/get?identifier=${identifier}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedItem(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.log(err);
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
        extraColumns={extraColumns}
      />

      {EditComponent && (
        <EditComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

ModelList.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  modelName: PropTypes.string.isRequired,
  EditComponent: PropTypes.elementType,
  extraColumns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    }),
  ),
};

export default ModelList;

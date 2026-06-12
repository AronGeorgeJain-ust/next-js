"use client";

import { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { validateForm } from "@/components/common/ValidationPage";

const getToken = () =>
  globalThis.window === undefined ? null : localStorage.getItem("token");

const EntityEdit = ({
  title,
  endpoint,
  validationFields,
  redirectTo,
  item,
  isOpen,
  onClose,
  onUpdateSuccess,
  transformItem,
  children,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(transformItem ? transformItem(item) : item);
    }
  }, [item, transformItem]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const validationErrors = validationFields
      ? validateForm(formData, { fields: validationFields })
      : validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await api.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      onUpdateSuccess(formData);
      onClose();
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const renderedChildren = Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child, { formData, handleChange, errors })
      : child
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="space-y-4">{renderedChildren}</div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

EntityEdit.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  validationFields: PropTypes.array,
  redirectTo: PropTypes.string.isRequired,
  item: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  transformItem: PropTypes.func,
  children: PropTypes.node,
};

export default EntityEdit;

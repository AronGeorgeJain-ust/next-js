"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import { validateForm } from "./ValidationPage";

const AddPage = ({ modelName, fields, initialData, children }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const token = globalThis.window?.localStorage?.getItem("token") ?? null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("Please fix the highlighted errors before saving.");
      return;
    }

    setErrors({});

    try {
      await api.post(`/${modelName}/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage(`${modelName} added successfully`);
      router.push(`/${modelName}`);
    } catch (err) {
      console.error(err);
      setMessage("Add failed");
    }
  };

  const fieldsWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const propsToAdd = {
      formData,
      handleChange,
      errors,
    };

    if (typeof child.props.filterOptions === "function") {
      propsToAdd.filterOptions = (items) => child.props.filterOptions(items, formData);
    }

    return cloneElement(child, propsToAdd);
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-blue-300 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white/90 p-6 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Add {modelName.charAt(0).toUpperCase() + modelName.slice(1)}
        </h2>

        {message && (
          <div className="mb-4 rounded bg-blue-50 px-4 py-2 text-sm text-blue-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {errors[field.name] && (
                <p className="mt-2 text-sm text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {fieldsWithProps}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push(`/${modelName}`)}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddPage.propTypes = {
  modelName: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  initialData: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default AddPage;

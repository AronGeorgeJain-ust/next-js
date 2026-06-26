"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

import api from "@/services/api";
import { validateForm } from "./ValidationPage";

const AddPage = ({ modelName, fields, initialData, children }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = globalThis.window?.localStorage?.getItem("token") ?? null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("Please fix the highlighted errors before saving.");
      setMessageType("error");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await api.post(`/${modelName}/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = res.data;

      if (data?.success === false) {
        setMessage(data.message || "Failed to save. Please check your inputs.");
        setMessageType("error");
        return;
      }

      setMessage(`${modelName} added successfully!`);
      setMessageType("success");

      setTimeout(() => router.push(`/${modelName}`), 800);
    } catch (err) {
      console.error(err);

      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save. Please try again.";
      setMessage(errMsg);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fieldsWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const propsToAdd = { formData, handleChange, errors };

    if (typeof child.props.filterOptions === "function") {
      propsToAdd.filterOptions = (items) =>
        child.props.filterOptions(items, formData);
    }

    return cloneElement(child, propsToAdd);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white/90 p-6 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Add {modelName.charAt(0).toUpperCase() + modelName.slice(1)}
        </h2>

        {message && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              messageType === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {messageType === "error" ? (
              <AlertCircle size={16} className="shrink-0" />
            ) : (
              <CheckCircle size={16} className="shrink-0" />
            )}
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
                  className={`w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.name] ? "border-red-400" : "border-gray-300"
                  }`}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.name] ? "border-red-400" : "border-gray-300"
                  }`}
                />
              )}

              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">
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
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save"}
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

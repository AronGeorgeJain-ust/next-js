import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import CustomerForm, {
  customerInitialData,
} from "@/components/customer/CustomerForm";
import api from "@/services/api";

const AddCustomerModal = ({ isOpen, onClose, onSaved, headers }) => {
  const [formData, setFormData] = useState(customerInitialData);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name?.trim()) nextErrors.name = "Name is required";
    if (!formData.phoneNo?.trim())
      nextErrors.phoneNo = "Phone number is required";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await api.post("/customer/add", formData, { headers });
      onSaved(res.data);
      setFormData(customerInitialData);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to add customer" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add New Customer</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <label
                htmlFor="customerName"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="phoneNo"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNo"
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {errors.phoneNo && (
                <p className="mt-1.5 text-sm text-red-500">{errors.phoneNo}</p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="creditLimit"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Credit Limit
              </label>
              <input
                id="creditLimit"
                type="number"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleChange}
                placeholder="Ex: 800"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <CustomerForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />

          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddCustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  headers: PropTypes.object.isRequired,
};

export default AddCustomerModal;

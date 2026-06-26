import PropTypes from "prop-types";

const EditModal = ({ formData, handleChange, editableFields, errors = {}, errorMessage, }) => {
  const AUDIT_FIELDS = ["createdBy", "createdOn", "modifiedBy", "modifiedOn"];

  console.log("errorMessage:", errorMessage);

  const formatValue = (field, value) => {
    if (value == null) return "Not Available";

    if (field === "createdOn" || field === "modifiedOn") {
      return new Date(value).toLocaleString();
    }

    return value;
  };

  if (errorMessage) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-600 text-lg font-semibold">
          Update Failed
        </div>

        <p className="mt-3 text-gray-700">
          {errorMessage}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {editableFields.map((key) => (
        <div key={key}>
          <label className="block mb-1 font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>

          <input
            type="text"
            name={key}
            value={formData[key] || ""}
            onChange={handleChange}
            readOnly={key === "identifier" || key === "priceType"}
            className={`w-full border rounded-lg px-3 py-2 ${
              key === "identifier" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errors[key] && (
            <p className="mt-2 text-sm text-red-500">{errors[key]}</p>
          )}
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-3 text-gray-700">Audit Information</h3>

        {AUDIT_FIELDS.map((field) => (
          <div key={field} className="mb-3">
            <label className="block mb-1 font-medium">{field}</label>

            <input
              type="text"
              value={formatValue(field, formData[field])}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

EditModal.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  editableFields: PropTypes.array.isRequired,
  errors: PropTypes.object,
  errorMessage: PropTypes.string,
};

export default EditModal;

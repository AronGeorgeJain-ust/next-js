import PropTypes from 'prop-types';

const EditModal = ({
  formData,
  handleChange,
  editableFields,
  errors = {},
}) => {
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
            readOnly={key === "identifier"}
            className={`w-full border rounded-lg px-3 py-2 ${
              key === "identifier"
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
          />
          {errors[key] && (
            <p className="mt-2 text-sm text-red-500">
              {errors[key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

EditModal.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  editableFields: PropTypes.array.isRequired,
  errors: PropTypes.object,
};

export default EditModal;
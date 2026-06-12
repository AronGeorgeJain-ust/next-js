const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[6-9]\d{9}$/;
const identifierPattern = /^[A-Za-z0-9_-]+$/;

const fieldLabels = {
  identifier: "Identifier",
  name: "Name",
  description: "Description",
  username: "Email",
  password: "Password",
  phoneNo: "Phone number",
  roles: "Roles",
  superCategory: "Super category",
  category: "Category",
  brandName: "Brand",
  model: "Model",
  unit: "Unit",
  productName: "Product",
  priceType: "Price type",
  value: "Value",
  path: "Path",
};

const defaultValidationRules = {
  identifier: {
    required: true,
    minLength: 3,
    pattern: identifierPattern,
    requiredMessage: "Identifier is required.",
    invalidMessage:
      "Identifier must be at least 3 characters and may include letters, numbers, - and _.",
  },
  name: {
    required: true,
    minLength: 3,
    requiredMessage: "Name is required.",
    invalidMessage: "Name must be at least 3 letters.",
  },
  description: {
    required: false,
    minLength: 5,
    invalidMessage: "Description must be at least 5 characters.",
  },
  username: {
    required: true,
    email: true,
    requiredMessage: "Email is required.",
    invalidMessage: "Enter a valid email address.",
  },
  password: {
    required: true,
    minLength: 6,
    requiredMessage: "Password is required.",
    invalidMessage: "Password must be at least 6 characters.",
  },
  phoneNo: {
    required: true,
    phone: true,
    requiredMessage: "Phone number is required.",
    invalidMessage:
      "Phone number must be a valid 10-digit number starting with 6-9.",
  },
  roles: {
    required: true,
    array: true,
    minLength: 1,
    requiredMessage: "Select at least one role.",
  },
  superCategory: {
    required: false,
    minLength: 1,
    requiredMessage: "Select a super category.",
  },
  category: {
    required: true,
    array: true,
    minLength: 1,
    requiredMessage: "Select at least one category.",
  },
  brandName: {
    required: true,
    requiredMessage: "Brand is required.",
  },
  model: {
    required: true,
    requiredMessage: "Model is required.",
  },
  unit: {
    required: true,
    requiredMessage: "Unit is required.",
  },
  productName: {
    required: true,
    requiredMessage: "Product is required.",
  },
  priceType: {
    required: true,
    requiredMessage: "Price type is required.",
  },
  value: {
    required: true,
    numeric: true,
    minValue: 0.01,
    requiredMessage: "A value is required.",
    invalidMessage: "Enter a valid numeric value greater than 0.",
  },
  path: {
    required: true,
    minLength: 1,
    requiredMessage: "Path is required.",
  },
};

const getFieldLabel = (fieldName) =>
  fieldLabels[fieldName] ||
  fieldName.replace(/([A-Z])/g, " $1").trim();

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const getErrorMessage = (rule, label, fallback) =>
  rule.invalidMessage || rule.requiredMessage || fallback(label);

const validateEmail = (value, rule, label) =>
  typeof value === "string" && !emailPattern.test(value)
    ? getErrorMessage(rule, label, () => `Enter a valid ${label.toLowerCase()}.`)
    : null;

const validatePhone = (value, rule, label) =>
  typeof value === "string" && !phonePattern.test(value)
    ? getErrorMessage(rule, label, () => `Enter a valid ${label.toLowerCase()}.`)
    : null;

const validatePattern = (value, rule, label) =>
  typeof value === "string" && !rule.pattern.test(value)
    ? getErrorMessage(rule, label, () => `Enter a valid ${label.toLowerCase()}.`)
    : null;

const validateArray = (value, rule, label) => {
  const length = Array.isArray(value) ? value.length : 0;

  return length < (rule.minLength || 1)
    ? getErrorMessage(rule, label, () => `${label} is required.`)
    : null;
};

const validateNumeric = (value, rule, label) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return rule.invalidMessage || `${label} must be a number.`;
  }

  if (rule.minValue != null && numericValue < rule.minValue) {
    return (
      rule.invalidMessage ||
      `${label} must be at least ${rule.minValue}.`
    );
  }

  return null;
};

const validateMinLength = (value, rule, label) =>
  typeof value === "string" &&
  value.trim().length < rule.minLength
    ? (
        rule.invalidMessage ||
        `${label} must be at least ${rule.minLength} characters.`
      )
    : null;

const runValidation = (value, rule, label) => {
  if (rule.email) {
    return validateEmail(value, rule, label);
  }

  if (rule.phone) {
    return validatePhone(value, rule, label);
  }

  if (rule.pattern) {
    return validatePattern(value, rule, label);
  }

  if (rule.array) {
    return validateArray(value, rule, label);
  }

  if (rule.numeric) {
    return validateNumeric(value, rule, label);
  }

  if (rule.minLength) {
    return validateMinLength(value, rule, label);
  }

  return null;
};

export const validateForm = (
  formData = {},
  { fields = Object.keys(formData), overrides = {} } = {}
) => {
  const rules = {
    ...defaultValidationRules,
    ...overrides,
  };

  const fieldsToValidate = new Set([
    ...fields,
    ...Object.keys(overrides),
  ]);

  return Object.entries(rules).reduce((errors, [fieldName, rule]) => {
    if (!fieldsToValidate.has(fieldName)) {
      return errors;
    }

    const value = formData[fieldName];
    const label = getFieldLabel(fieldName);

    if (rule.required && isEmptyValue(value)) {
      errors[fieldName] =
        rule.requiredMessage || `${label} is required.`;

      return errors;
    }

    if (isEmptyValue(value)) {
      return errors;
    }

    const error = runValidation(value, rule, label);

    if (error) {
      errors[fieldName] = error;
    }

    return errors;
  }, {});
};

export default validateForm;
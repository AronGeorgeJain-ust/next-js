const emailPattern = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,10}$/;
const phonePattern = /^[6-9]\d{9}$/;
const identifierPattern = /^[A-Za-z0-9_-]+$/;
const credentialPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
const namePattern = /^[A-Za-z\s'-]+$/;
const pathPattern = /^\/[A-Za-z0-9/_-]*$/;

const fieldLabels = {
  identifier: "Identifier",
  name: "Name",
  description: "Description",
  username: "Email",
  userCredential: "Password",
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
    maxLength: 50,
    pattern: identifierPattern,
    requiredMessage: "Identifier is required.",
    invalidMessage:
      "Identifier must be 3–50 characters and may only contain letters, numbers, hyphens and underscores.",
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: namePattern,
    requiredMessage: "Name is required.",
    invalidMessage:
      "Name must be 2–100 characters and may only contain letters, spaces, hyphens and apostrophes.",
  },
  description: {
    required: false,
    minLength: 5,
    maxLength: 500,
    invalidMessage: "Description must be between 5 and 500 characters.",
  },
  username: {
    required: true,
    email: true,
    maxLength: 254,
    requiredMessage: "Email is required.",
    invalidMessage: "Enter a valid email address (e.g. user@example.com).",
  },
  userCredential: {
    required: true,
    minLength: 6,
    maxLength: 128,
    pattern: credentialPattern,
    requiredMessage: "Password is required.",
    invalidMessage:
      "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number.",
  },
  phoneNo: {
    required: true,
    phone: true,
    requiredMessage: "Phone number is required.",
    invalidMessage:
      "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
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
    minLength: 1,
    maxLength: 100,
    requiredMessage: "Brand is required.",
    invalidMessage: "Brand name must be between 1 and 100 characters.",
  },
  model: {
    required: true,
    minLength: 1,
    maxLength: 100,
    requiredMessage: "Model is required.",
    invalidMessage: "Model must be between 1 and 100 characters.",
  },
  unit: {
    required: true,
    minLength: 1,
    maxLength: 20,
    requiredMessage: "Unit is required.",
    invalidMessage: "Unit must be between 1 and 20 characters.",
  },
  productName: {
    required: true,
    minLength: 2,
    maxLength: 150,
    requiredMessage: "Product name is required.",
    invalidMessage: "Product name must be between 2 and 150 characters.",
  },
  priceType: {
    required: true,
    requiredMessage: "Price type is required.",
  },
  value: {
    required: true,
    numeric: true,
    minValue: 0.01,
    maxValue: 9_999_999.99,
    requiredMessage: "A value is required.",
    invalidMessage: "Enter a valid amount between 0.01 and 9,999,999.99.",
  },
  path: {
    required: true,
    minLength: 1,
    maxLength: 200,
    pattern: pathPattern,
    requiredMessage: "Path is required.",
    invalidMessage:
      "Path must start with / and may only contain letters, numbers, hyphens, underscores and forward slashes.",
  },
};

const getFieldLabel = (fieldName) =>
  fieldLabels[fieldName] || fieldName.replaceAll(/([A-Z])/g, " $1").trim();

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const getErrorMessage = (rule, label, fallback) =>
  rule.invalidMessage || rule.requiredMessage || fallback(label);

const validateEmail = (value, rule, label) =>
  typeof value === "string" && !emailPattern.test(value.trim())
    ? getErrorMessage(
        rule,
        label,
        () => `Enter a valid ${label.toLowerCase()}.`,
      )
    : null;

const validatePhone = (value, rule, label) =>
  typeof value === "string" && !phonePattern.test(value.trim())
    ? getErrorMessage(
        rule,
        label,
        () => `Enter a valid ${label.toLowerCase()}.`,
      )
    : null;

const validatePattern = (value, rule, label) =>
  typeof value === "string" && !rule.pattern.test(value)
    ? getErrorMessage(
        rule,
        label,
        () => `Enter a valid ${label.toLowerCase()}.`,
      )
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
    return rule.invalidMessage || `${label} must be at least ${rule.minValue}.`;
  }
  if (rule.maxValue != null && numericValue > rule.maxValue) {
    return rule.invalidMessage || `${label} must not exceed ${rule.maxValue}.`;
  }

  return null;
};

const validateMinLength = (value, rule, label) =>
  typeof value === "string" && value.trim().length < rule.minLength
    ? rule.invalidMessage ||
      `${label} must be at least ${rule.minLength} characters.`
    : null;

const validateMaxLength = (value, rule, label) =>
  typeof value === "string" && value.trim().length > rule.maxLength
    ? rule.invalidMessage ||
      `${label} must not exceed ${rule.maxLength} characters.`
    : null;

const runValidation = (value, rule, label) => {
  if (rule.email) return validateEmail(value, rule, label);
  if (rule.phone) return validatePhone(value, rule, label);
  if (rule.array) return validateArray(value, rule, label);
  if (rule.numeric) return validateNumeric(value, rule, label);

  if (rule.maxLength) {
    const maxErr = validateMaxLength(value, rule, label);
    if (maxErr) return maxErr;
  }

  if (rule.minLength) {
    const minErr = validateMinLength(value, rule, label);
    if (minErr) return minErr;
  }

  if (rule.pattern) return validatePattern(value, rule, label);

  return null;
};

export const validateForm = (
  formData = {},
  { fields = Object.keys(formData), overrides = {} } = {},
) => {
  const rules = {
    ...defaultValidationRules,
    ...overrides,
  };

  const fieldsToValidate = new Set([...fields, ...Object.keys(overrides)]);

  return Object.entries(rules).reduce((errors, [fieldName, rule]) => {
    if (!fieldsToValidate.has(fieldName)) return errors;

    const value = formData[fieldName];
    const label = getFieldLabel(fieldName);

    if (rule.required && isEmptyValue(value)) {
      errors[fieldName] = rule.requiredMessage || `${label} is required.`;
      return errors;
    }

    if (isEmptyValue(value)) return errors;

    const error = runValidation(value, rule, label);
    if (error) errors[fieldName] = error;

    return errors;
  }, {});
};

export default validateForm;

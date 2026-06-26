"use client";

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import api from "@/services/api";

const Dropdown = ({
  name,
  label,
  placeholder = "Select",
  disabled = false,
  value,
  onChange,
  formData,
  handleChange,
  errors = {},
  endpoint,
  method = "post",
  requestBody = { page: 0, sizePerPage: 100 },
  requestHeaders = {},
  disableFetch = false,
  options = [],
  optionKey = (item, index) => item?.identifier ?? item?.name ?? index,
  optionValue = (item) => item?.identifier ?? item?.name ?? item,
  optionLabel = (item) => item?.name ?? item?.identifier ?? item,
  filterOptions = (items) => items,
  normalizeValue,
  multiple = false,
  selectClassName = "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500",
}) => {
  const [items, setItems] = useState(options || []);
  const [fetchError, setFetchError] = useState("");

  const errorMessage = errors?.[name];
  const effectiveValue = value ?? formData?.[name];
  const effectiveOnChange = onChange ?? handleChange;

  const requestBodyRef = useRef(requestBody);
  useEffect(() => {
    requestBodyRef.current = requestBody;
  }, [JSON.stringify(requestBody)]);

  const getToken = () =>
    globalThis.window?.localStorage?.getItem("token") ?? null;

  useEffect(() => {
    if (options && options.length > 0) {
      setItems(options);
      return;
    }

    if (disableFetch || !endpoint) return;

    let isMounted = true;

    const fetchData = async () => {
      setFetchError("");
      try {
        const token = getToken();
        const headers = {
          ...requestHeaders,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        if (method.toLowerCase() !== "get" && !headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }

        const response = await api.request({
          url: endpoint,
          method,
          data: requestBodyRef.current,
          headers,
        });

        const responseData = response?.data;

        const nextItems =
          responseData?.dtoList ??
          responseData?.content ??
          responseData?.data ??
          (Array.isArray(responseData) ? responseData : []);

        if (isMounted) {
          setItems(nextItems);
        }
      } catch (error) {
        console.error(`Dropdown [${name}] fetch error:`, error);
        if (isMounted) setFetchError("Failed to load options.");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, method, disableFetch, name]);

  const ensureArray = (val) => {
    if (Array.isArray(val)) return val;
    return val ? [val] : [];
  };

  const normalizedValue = multiple
    ? ensureArray(effectiveValue)
    : (effectiveValue ?? "");

  const handleSelectChange = (e) => {
    const nextValue = multiple
      ? Array.from(e.target.selectedOptions).map((opt) => opt.value)
      : e.target.value;

    const finalValue = normalizeValue ? normalizeValue(nextValue) : nextValue;

    effectiveOnChange?.({
      target: { name, value: finalValue },
    });
  };

  const renderedOptions = filterOptions(items, formData);

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={normalizedValue}
        onChange={handleSelectChange}
        multiple={multiple}
        className={`${selectClassName} ${errorMessage ? "border-red-400" : ""}`}
        disabled={disabled}
      >
        {!multiple && <option value="">{placeholder}</option>}

        {renderedOptions.map((item, index) => (
          <option
            key={optionKey(item, index)}
            value={String(optionValue(item))}
          >
            {optionLabel(item)}
          </option>
        ))}
      </select>

      {fetchError && (
        <p className="mt-1 text-xs text-orange-500">{fetchError}</p>
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  errors: PropTypes.object,
  endpoint: PropTypes.string,
  method: PropTypes.string,
  requestBody: PropTypes.object,
  requestHeaders: PropTypes.object,
  disableFetch: PropTypes.bool,
  options: PropTypes.array,
  optionKey: PropTypes.func,
  optionValue: PropTypes.func,
  optionLabel: PropTypes.func,
  filterOptions: PropTypes.func,
  normalizeValue: PropTypes.func,
  multiple: PropTypes.bool,
  selectClassName: PropTypes.string,
};

export default Dropdown;

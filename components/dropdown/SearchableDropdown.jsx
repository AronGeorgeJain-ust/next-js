"use client";

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import api from "@/services/api";

const SearchableDropdown = ({
  value,
  onChange,
  placeholder,
  getLabel,
  getValue,
  searchEndpoint,
  searchParam = "query",
  minChars = 1,
  debounceMs = 300,
  selectedLabel,
}) => {
  const [search, setSearch] = useState(selectedLabel ?? "");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const token = globalThis.localStorage?.getItem("token");

  useEffect(() => {
    if (selectedLabel !== undefined) setSearch(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim().length < minChars) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(searchEndpoint, {
          params: { [searchParam]: search.trim() },
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data ?? []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(debounceRef.current);
  }, [search, searchEndpoint, searchParam, minChars, debounceMs, token]);

  const handleSelect = (item) => {
    onChange(getValue(item));
    setSearch(getLabel(item));
    setOpen(false);
    inputRef.current?.blur();
  };

  let dropdownContent;

  if (loading) {
    dropdownContent = (
      <div className="px-3 py-2 text-sm text-gray-400">Searching…</div>
    );
  } else if (search.trim().length < minChars) {
    dropdownContent = (
      <div className="px-3 py-2 text-sm text-gray-400">Type to search…</div>
    );
  } else if (results.length > 0) {
    dropdownContent = results.map((item) => (
      <button
        type="button"
        key={getValue(item)}
        onClick={() => handleSelect(item)}
        className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100"
      >
        {getLabel(item)}
      </button>
    ));
  } else {
    dropdownContent = (
      <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={search}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          if (e.target.value === "") onChange("");
        }}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {dropdownContent}
        </div>
      )}
    </div>
  );
};

SearchableDropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  getLabel: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
  searchEndpoint: PropTypes.string.isRequired,
  searchParam: PropTypes.string,
  minChars: PropTypes.number,
  debounceMs: PropTypes.number,
  selectedLabel: PropTypes.string,
};

export default SearchableDropdown;

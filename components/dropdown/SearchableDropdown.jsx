import { useState, useMemo, useRef, useEffect } from "react";

import PropTypes from "prop-types";

const SearchableDropdown = ({
  items,
  value,
  onChange,
  placeholder,
  getLabel,
  getValue,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, getLabel]);

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
        }}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                type="button"
                key={getValue(item)}
                onClick={() => {
                  onChange(getValue(item));
                  setSearch(getLabel(item));
                  setOpen(false);
                  inputRef.current?.blur();
                }}
                className="block w-full cursor-pointer px-3 py-2 text-left hover:bg-gray-100"
              >
                {getLabel(item)}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchableDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  getLabel: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

export default SearchableDropdown;
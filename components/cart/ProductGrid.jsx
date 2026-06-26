import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Search, ShoppingBag } from "lucide-react";
import api from "@/services/api";

const ProductGrid = ({ onAdd, addingProduct, headers }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (search.trim().length === 0) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await api.get("/product/search", {
          params: { query: search.trim() },
          headers,
        });

        setResults(res.data ?? []);
      } catch (err) {
        console.error("Product search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, headers]);

  let content;

  if (search.trim().length === 0) {
    content = (
      <p className="col-span-3 text-center text-xs text-gray-400 py-6">
        Type to search for a product
      </p>
    );
  } else if (loading) {
    content = (
      <p className="col-span-3 text-center text-xs text-gray-400 py-6">
        Searching…
      </p>
    );
  } else if (results.length === 0) {
    content = (
      <p className="col-span-3 text-center text-xs text-gray-400 py-6">
        No products found
      </p>
    );
  } else {
    content = results.map((p) => {
      const isAdding = addingProduct === p.identifier;
      const stockQuantity = Number(p.stockQuantity ?? 0);
      const isOutOfStock = stockQuantity <= 0;

      return (
        <div
          key={p.identifier}
          className={`border rounded-xl p-3 flex justify-between items-start transition group ${
            isOutOfStock
              ? "border-gray-200 bg-gray-50"
              : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
          }`}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {p.name ?? p.identifier}
            </p>

            {p.category && (
              <p className="text-xs text-gray-400 truncate">{p.category}</p>
            )}

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 line-through">
                ₹{Number(p.mrp ?? 0).toLocaleString("en-IN")}
              </span>

              <span className="text-xs font-bold text-gray-900">
                ₹{Number(p.sellingPrice ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <p
              className={`mt-1 text-[11px] font-semibold ${
                isOutOfStock ? "text-red-600" : "text-green-600"
              }`}
            >
              {isOutOfStock ? "Out of stock" : `In stock: ${stockQuantity}`}
            </p>
          </div>

          <button
            onClick={() => onAdd(p)}
            disabled={isAdding || isOutOfStock}
            aria-label={`Add ${p.name ?? p.identifier} to cart`}
            className="ml-2 w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40 transition-all duration-200 shrink-0"
          >
            {isAdding ? (
              <span className="text-[10px] font-bold leading-none">...</span>
            ) : (
              <ShoppingBag size={13} />
            )}
          </button>
        </div>
      );
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm py-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Products
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-56">
          <Search size={13} className="text-gray-400 shrink-0" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="py-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
        {content}
      </div>
    </div>
  );
};

ProductGrid.propTypes = {
  onAdd: PropTypes.func.isRequired,
  addingProduct: PropTypes.string,
  headers: PropTypes.object.isRequired,
};

export default ProductGrid;

import PropTypes from "prop-types";
import { fmt } from "@/utils/currency";
import { Trash2 } from "lucide-react";

const CartTable = ({ entries, onQtyChange, onRemove }) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        Cart items
      </p>
      <span className="text-xs text-gray-600 font-semibold px-2.5 py-1">
        {entries.length} item{entries.length === 1 ? "" : "s"}
      </span>
    </div>

    <table className="w-full text-xs" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr className="bg-gray-50 border-b border-gray-100">
          <th className="px-4 py-2.5 text-left font-semibold text-gray-500 w-1/5">
            Product
          </th>
          <th className="px-4 py-2.5 text-left font-semibold text-gray-500 w-1/5">
            MRP
          </th>
          <th className="px-3 py-2.5 text-right font-semibold text-gray-500 w-1/5">
            Unit Price
          </th>
          <th className="px-3 py-2.5 text-center font-semibold text-gray-500 w-1/5">
            Qty
          </th>
          <th className="px-3 py-2.5 text-right font-semibold text-gray-500 w-1/5">
            Total
          </th>
          <th className="w-8"></th>
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-10 text-center text-gray-400 text-xs"
            >
              Click a product above to add it to the cart
            </td>
          </tr>
        ) : (
          entries.map((entry, i) => (
            <tr
              key={entry.identifier ?? i}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-semibold text-gray-900 truncate">
                {entry.product}
              </td>
              <td className="px-3 py-3 text-right text-gray-600">
                {fmt(entry.originalPrice)}
              </td>
              <td className="px-3 py-3 text-right text-gray-600">
                {fmt(entry.unitPrice)}
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      onQtyChange(i, Math.max(1, Number(entry.quantity) - 1))
                    }
                    className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs transition-colors"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-semibold text-gray-900">
                    {entry.quantity}
                  </span>
                  <button
                    onClick={() => onQtyChange(i, Number(entry.quantity) + 1)}
                    className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs transition-colors"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-3 py-3 text-right font-semibold text-gray-900">
                {fmt(entry.totalPrice)}
              </td>
              <td className="py-3 pr-3 text-center">
                <button
                  onClick={() => onRemove(i)}
                  className="p-1 text-red-400 hover:text-red-600 rounded-md hover:bg-red-50 inline-flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

CartTable.propTypes = {
  entries: PropTypes.array.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartTable;

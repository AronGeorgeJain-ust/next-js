import PropTypes from "prop-types";
import { fmt } from "@/utils/currency";
import { today } from "@/utils/date";

const BillingPanel = ({
  cart,
  entries,
  customer,
  customerObj,
  onClearCart,
  onSave,
  router,
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl flex flex-col h-full shadow-sm">
    <div className="px-5 py-4 border-b border-gray-100">
      <p className="text-sm font-bold text-gray-900">Order Summary</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {entries.length} item{entries.length === 1 ? "" : "s"} in cart
      </p>
    </div>

    <div className="px-5 py-4 border-b border-gray-100 flex flex-col gap-2 max-h-40 overflow-y-auto">
      {entries.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">No items yet</p>
      ) : (
        entries.map((e) => (
          <div key={e.identifier} className="flex justify-between text-xs">
            <span className="text-gray-500 truncate mr-2">
              {e.product} × {e.quantity}
            </span>
            <span className="text-gray-900 shrink-0 font-medium">
              {fmt(e.totalPrice)}
            </span>
          </div>
        ))
      )}
    </div>

    <div className="px-5 py-4 border-b border-gray-100 flex flex-col gap-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Original price</span>
        <span className="text-gray-900">{fmt(cart?.totalOriginalPrice)}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Discount</span>
        <span className="text-green-600">- {fmt(cart?.totalDiscount)}</span>
      </div>
      <div className="flex justify-between items-baseline mt-1 pt-2 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-900">Total payable</span>
        <span className="text-lg font-bold text-gray-900">
          {fmt(cart?.totalPrice)}
        </span>
      </div>
    </div>

    <div className="px-5 py-4 border-b border-gray-100">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
        Bill to
      </p>
      {customerObj ? (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-xs font-bold text-red-700 shrink-0">
            {(customerObj.name ?? "?")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {customerObj.name}
            </p>
            <p className="text-xs text-gray-500">{customerObj.phoneNo}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400">No customer selected</p>
      )}
    </div>

    <div className="px-5 py-3 border-b border-gray-100 flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Cart ID</span>
        <span className="text-gray-600 font-medium">{customer || "—"}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Date</span>
        <span className="text-gray-600 font-medium">{today()}</span>
      </div>
    </div>

    <div className="flex-1" />

    <div className="px-5 py-4 flex flex-col gap-2">
      <button
        onClick={onSave}
        disabled={!customer || entries.length === 0}
        className="w-full py-3 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
      >
        Checkout
      </button>
      <button
        onClick={onClearCart}
        disabled={!customer}
        className="w-full py-3 rounded-xl bg-red-50 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40 transition-colors"
      >
        Clear cart
      </button>
      <button
        onClick={() => router.push("/home")}
        className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
    </div>
  </div>
);

BillingPanel.propTypes = {
  cart: PropTypes.object,
  entries: PropTypes.array.isRequired,
  customer: PropTypes.string,
  customerObj: PropTypes.object,
  onClearCart: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

export default BillingPanel;

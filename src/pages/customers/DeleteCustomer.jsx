import { AlertTriangle, X } from "lucide-react";

export default function DeleteCustomer({
  darkMode,
  customer,
  setShowDeleteModal,
  onDeleteCustomer,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-2">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl overflow-hidden ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={26} />
            </div>
            <h2 className="text-2xl font-bold">Delete Customer</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <p
            className={`text-center text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {customer?.name || "this customer"}
            </span>
            ?
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 px-2  pb-6">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className={`min-w-[160px] px-6 py-3 rounded-xl font-semibold border cursor-pointer transition ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onDeleteCustomer(customer.id)}
            className="min-w-[160px] px-6 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white cursor-pointer transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

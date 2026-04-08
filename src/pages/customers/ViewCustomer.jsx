import { X, Mail, Phone, CalendarDays, BadgeCheck } from "lucide-react";

export default function ViewCustomer({
  darkMode,
  customer,
  setShowViewModal,
}) {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Customer Details</h2>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`rounded-2xl p-6 border ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 shrink-0 border border-gray-400 cursor-pointer">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">{customer.name}</h3>
                <p className="text-sm text-gray-500">
                  Customer ID: {customer.id}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-sm">{customer.email}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-sm">{customer.phone}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      customer.status,
                    )}`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Joined Date</span>
                  </div>
                  <p className="text-sm">
                    {new Date(customer.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
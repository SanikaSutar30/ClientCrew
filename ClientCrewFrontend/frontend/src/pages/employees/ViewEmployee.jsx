import {
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Briefcase,
} from "lucide-react";

export default function ViewEmployee({ darkMode, employee, setShowViewModal }) {
  if (!employee) return null;

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not added";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not added";
    }

    return date.toLocaleDateString();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowViewModal(false);
      }}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Employee Details</h2>

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
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 shrink-0 border border-gray-400">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="mt-4 text-center md:text-left">
                <h3 className="text-2xl font-bold">{employee.name}</h3>
                <p className="text-sm text-gray-500">User ID: {employee.id}</p>
              </div>

              <div className="mt-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                    employee.status,
                  )}`}
                >
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
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
                  <p className="text-sm break-all">
                    {employee.email || "Not added"}
                  </p>
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
                  <p className="text-sm">{employee.phone || "Not added"}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Role</span>
                  </div>
                  <p className="text-sm">{employee.role || "Not added"}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">Department</span>
                  </div>
                  <p className="text-sm">
                    {employee.department || "Not added"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-red-500" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-sm">{employee.location || "Not added"}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={16} className="text-cyan-500" />
                    <span className="text-sm font-medium">Joined Date</span>
                  </div>
                  <p className="text-sm">{formatDate(employee.joinedDate)}</p>
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

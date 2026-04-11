import {
  Mail,
  Phone,
  CalendarDays,
  BadgeCheck,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function MyProfile() {
  const { darkMode } = useOutletContext();

  const profile = {
    id: "ADM-001",
    name: "Admin Name",
    email: "admin@company.com",
    phone: "+91 9876543210",
    role: "Administrator",
    status: "Active",
    joinedDate: "2024-01-10",
    image: "../assets/Profile.jpg",
  };

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
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
        >
          My Profile
        </h1>
        <p
          className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
        >
          View your profile details and account information
        </p>
      </div>

      <div
        className={`w-full max-w-4xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`rounded-2xl p-6 border ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-300 shrink-0 border border-gray-400">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                <p className="text-sm text-gray-500">
                  Profile ID: {profile.id}
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
                  <p className="text-sm">{profile.email}</p>
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
                  <p className="text-sm">{profile.phone}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">Role</span>
                  </div>
                  <p className="text-sm">{profile.role}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      profile.status,
                    )}`}
                  >
                    {profile.status}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl md:col-span-2 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={16} className="text-pink-500" />
                    <span className="text-sm font-medium">Joined Date</span>
                  </div>
                  <p className="text-sm">
                    {new Date(profile.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer hover:opacity-90">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useOutletContext } from "react-router-dom";
import { Search, Plus } from "lucide-react";

export default function Projects() {
  const { darkMode } = useOutletContext();

  const cardClass = darkMode
    ? "bg-gray-700 border border-gray-600 text-white"
    : "bg-white border border-gray-200 text-black";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-gray-500">
            Manage all your projects, track progress & collaborate
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#0f766e] text-white rounded-xl">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Projects", value: 12 },
          { title: "In Progress", value: 5 },
          { title: "Completed", value: 4 },
          { title: "On Hold", value: 3 },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl ${cardClass}`}>
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-4">
          {/* Search + Filters */}
          <div className={`p-4 rounded-xl ${cardClass}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="ml-2 bg-transparent outline-none w-full"
                />
              </div>

              <select className="px-3 py-2 rounded-lg border">
                <option>All Status</option>
              </select>

              <select className="px-3 py-2 rounded-lg border">
                <option>All Clients</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className={`p-4 rounded-xl ${cardClass}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody className="space-y-2">
                {[
                  {
                    name: "E-commerce Website",
                    client: "ABC Tech",
                    status: "In Progress",
                    progress: 70,
                  },
                  {
                    name: "Mobile App",
                    client: "XYZ",
                    status: "Completed",
                    progress: 100,
                  },
                ].map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-3">{p.name}</td>
                    <td>{p.client}</td>
                    <td>{p.status}</td>
                    <td>{p.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${cardClass}`}>
            <h2 className="font-semibold mb-3">Quick Actions</h2>

            <div className="space-y-2">
              <button className="w-full p-2 bg-gray-100 rounded-lg">
                New Project
              </button>
              <button className="w-full p-2 bg-gray-100 rounded-lg">
                Project Board
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${cardClass}`}>
            <h2 className="font-semibold mb-3">Upcoming Deadlines</h2>

            <p className="text-sm text-gray-500">E-commerce Website - 3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

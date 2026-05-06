// import { useState } from "react";
// import { useNavigate, useOutletContext } from "react-router-dom";

// import {
//   Calendar,
//   ChevronDown,
//   Users,
//   UserCheck,
//   Folder,
//   Activity,
// } from "lucide-react";

// import AddCustomer from "../customers/AddCustomer";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export default function Dashboard() {
//   const dashboardData = {
//     Today: {
//       customers: 5,
//       employees: 2,
//       projects: 1,
//       interactions: 8,
//     },
//     "This Week": {
//       customers: 12,
//       employees: 6,
//       projects: 4,
//       interactions: 25,
//     },
//     "This Month": {
//       customers: 24,
//       employees: 132,
//       projects: 18,
//       interactions: 120,
//     },
//     "This Year": {
//       customers: 120,
//       employees: 300,
//       projects: 80,
//       interactions: 600,
//     },
//   };

//   const customerGrowthData = [
//     { month: "Jan", customers: 70 },
//     { month: "Feb", customers: 120 },
//     { month: "Mar", customers: 140 },
//     { month: "Apr", customers: 160 },
//     { month: "May", customers: 210 },
//     { month: "Jun", customers: 250 },
//   ];

//   const outletContext = useOutletContext() || {};
//   const darkMode = outletContext.darkMode ?? false;
//   // Modal visibility state
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [selectedFilter, setSelectedFilter] = useState("This Month");
//   const [open, setOpen] = useState(false);

//   const [customers, setCustomers] = useState([
//     {
//       id: 1,
//       name: "Rahul Sharma",
//       email: "rahul@gmail.com",
//       phone: "+91 9876543210",
//       status: "Active",
//       joinedDate: "2024-01-12",
//       image: "../assets/Profile.jpg",
//     },
//     {
//       id: 2,
//       name: "Amit Patil",
//       email: "amit@gmail.com",
//       phone: "+91 9123456789",
//       status: "Active",
//       joinedDate: "2024-02-03",
//       image: "../assets/Profile2.jpg",
//     },
//     {
//       id: 3,
//       name: "Priya Singh",
//       email: "priya@gmail.com",
//       phone: "+91 9988776655",
//       status: "Pending",
//       joinedDate: "2024-03-18",
//       image: "../assets/Profile3.jpg",
//     },
//     {
//       id: 4,
//       name: "John Doe",
//       email: "john@gmail.com",
//       phone: "+91 8877655443",
//       status: "Inactive",
//       joinedDate: "2024-04-02",
//       image: "../assets/Profile4.jpg",
//     },
//     {
//       id: 5,
//       name: "Neha Verma",
//       email: "neha@gmail.com",
//       phone: "+91 9284711223",
//       status: "Active",
//       joinedDate: "2024-04-10",
//       image: "../assets/Profile5.jpg",
//     },
//     {
//       id: 6,
//       name: "Suresh Reddy",
//       email: "suresh@gmail.com",
//       phone: "+91 9032144556",
//       status: "Active",
//       joinedDate: "2024-05-22",
//       image: "../assets/Profile6.jpg",
//     },
//   ]);

//   const options = ["Today", "This Week", "This Month", "This Year"];
//   const currentData = dashboardData[selectedFilter];

//   // initialize navigate for view all button
//   const navigate = useNavigate();
//   // state for chart filter (monthly/weekly)
//   const [chartFilter, setChartFilter] = useState("Monthly");

//   // dummy data for source distribution and top customers, replace with real data when API is ready
//   const sourceData = [
//     { name: "Direct", value: 45, color: "#0f766e" },
//     { name: "Referral", value: 25, color: "#3b82f6" },
//     { name: "Organic", value: 20, color: "#f59e0b" },
//     { name: "Others", value: 10, color: "#6366f1" },
//   ];

//   const handleAddCustomer = (newCustomer) => {
//     setCustomers((prev) => [
//       {
//         id: prev.length + 1,
//         ...newCustomer,
//       },
//       ...prev,
//     ]);
//     setShowAddModal(false);
//   };

//   return (
//     <div className="space-y-6">
//       {showAddModal && (
//         <AddCustomer
//           darkMode={darkMode}
//           setShowAddModal={setShowAddModal}
//           onAddCustomer={handleAddCustomer}
//         />
//       )}

//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Dashboard</h1>
//           <p className="text-sm text-gray-500">
//             Monitor your business metrics and performance
//           </p>
//         </div>

//         <div className="relative">
//           <div
//             onClick={() => setOpen(!open)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition ${
//               darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
//             }`}
//           >
//             <Calendar
//               size={18}
//               className={darkMode ? "text-gray-300" : "text-gray-500"}
//             />
//             <span
//               className={`text-sm font-medium ${
//                 darkMode ? "text-white" : "text-gray-700"
//               }`}
//             >
//               {selectedFilter}
//             </span>
//             <ChevronDown
//               size={16}
//               className={darkMode ? "text-gray-300" : "text-gray-500"}
//             />
//           </div>

//           {open && (
//             <div
//               className={`absolute right-0 mt-2 w-40 rounded-xl shadow-md border z-50 ${
//                 darkMode ? "bg-gray-700 border-gray-600" : "bg-white"
//               }`}
//             >
//               {options.map((item) => (
//                 <div
//                   key={item}
//                   onClick={() => {
//                     setSelectedFilter(item);
//                     setOpen(false);
//                   }}
//                   className={`px-4 py-2 text-sm cursor-pointer rounded-lg ${
//                     darkMode
//                       ? "text-gray-200 hover:bg-gray-600"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
// {/* cards */}
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//   {[
//     {
//       title: "Total Customers",
//       value: currentData.customers,
//       icon: Users,
//       bg: "bg-[#0f766e]/10",
//       color: "text-[#0f766e]",
//     },
//     {
//       title: "Total Employees",
//       value: currentData.employees,
//       icon: UserCheck,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//     {
//       title: "Total Projects",
//       value: currentData.projects,
//       icon: Folder,
//       bg: "bg-purple-100",
//       color: "text-purple-600",
//     },
//     {
//       title: "Interactions",
//       value: currentData.interactions,
//       icon: Activity,
//       bg: "bg-orange-100",
//       color: "text-orange-600",
//     },
//   ].map((item) => {
//     const Icon = item.icon;

//     return (
//       <div
//         key={item.title}
//         className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between ${
//           darkMode
//             ? "bg-gray-700 border border-gray-600"
//             : "bg-white border border-gray-100"
//         }`}
//       >
//         {/* LEFT: text */}
//         <div>
//           <p
//             className={`text-sm font-medium ${
//               darkMode ? "text-gray-300" : "text-gray-500"
//             }`}
//           >
//             {item.title}
//           </p>

//           <h2
//             className={`text-2xl font-bold mt-2 ${
//               darkMode ? "text-white" : "text-black"
//             }`}
//           >
//             {item.value}
//           </h2>
//         </div>

//         {/* RIGHT: centered icon box (like project cards) */}
//         <div
//           className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
//         >
//           <Icon size={22} className={item.color} />
//         </div>
//       </div>
//     );
//   })}
// </div>

//       {/* Chart */}
//       <div
//         className={`grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-100 ${
//           darkMode ? "bg-gray-800" : "bg-gray-100"
//         } p-6 rounded-2xl border ${
//           darkMode ? "border-gray-600" : "border-gray-200"
//         }`}
//       >
//         {/*  customer growth*/}
//         <div
//           className={`lg:col-span-2 p-6 rounded-2xl shadow-sm ${
//             darkMode
//               ? "bg-gray-700 border border-gray-600"
//               : "bg-white border border-gray-100"
//           }`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2
//               className={`text-xl font-semibold ${
//                 darkMode ? "text-white" : "text-black"
//               }`}
//             >
//               Customer Growth
//             </h2>

//             <div
//               className={`flex items-center rounded-full p-1 ${
//                 darkMode ? "bg-gray-600" : "bg-gray-100"
//               }`}
//             >
//               {/* Monthly */}
//               <button
//                 onClick={() => setChartFilter("Monthly")}
//                 className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
//                   chartFilter === "Monthly"
//                     ? darkMode
//                       ? "bg-gray-500 text-white"
//                       : "bg-white text-gray-700 shadow-sm"
//                     : darkMode
//                       ? "text-gray-300"
//                       : "text-gray-500"
//                 }`}
//               >
//                 Monthly
//               </button>

//               {/* Weekly */}
//               <button
//                 onClick={() => setChartFilter("Weekly")}
//                 className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
//                   chartFilter === "Weekly"
//                     ? darkMode
//                       ? "bg-gray-500 text-white"
//                       : "bg-white text-gray-700 shadow-sm"
//                     : darkMode
//                       ? "text-gray-300"
//                       : "text-gray-500"
//                 }`}
//               >
//                 Weekly
//               </button>
//             </div>
//           </div>

//           <div className="w-full h-[320px]">
//             {/* ResponsiveContainer  is used for */}
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={customerGrowthData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke={darkMode ? "#4b5563" : "#e5e7eb"}
//                 />
//                 <XAxis
//                   dataKey="month"
//                   stroke={darkMode ? "#d1d5db" : "#6b7280"}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <YAxis
//                   stroke={darkMode ? "#d1d5db" : "#6b7280"}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: darkMode ? "#374151" : "#ffffff",
//                     border: "none",
//                     borderRadius: "12px",
//                     color: darkMode ? "#ffffff" : "#111827",
//                     boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="customers"
//                   stroke="#0f766e"
//                   strokeWidth={3}
//                   dot={{
//                     r: 5,
//                     fill: "#ffffff",
//                     stroke: "#0f766e",
//                     strokeWidth: 3,
//                   }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* recent customers */}
//         <div
//           className={`p-6 rounded-2xl shadow-sm ${
//             darkMode
//               ? "bg-gray-700 border border-gray-600"
//               : "bg-white border border-gray-100"
//           }`}
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h2
//               className={`text-xl font-semibold ${
//                 darkMode ? "text-white" : "text-black"
//               }`}
//             >
//               Recent Customers
//             </h2>
//             <button
//               //   Navigate to customers page on click
//               onClick={() => navigate("/customers")}
//               className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition"
//             >
//               View All
//             </button>
//           </div>

//           <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {customers.map((customer) => (
//               <div
//                 key={customer.id}
//                 className="flex items-center justify-between gap-3"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-300 shrink-0">
//                     <img
//                       src={customer.image}
//                       alt={customer.name}
//                       className="w-full h-full object-cover object-top"
//                     />
//                   </div>
//                   <div>
//                     <h3
//                       className={`text-base font-semibold ${
//                         darkMode ? "text-white" : "text-black"
//                       }`}
//                     >
//                       {customer.name}
//                     </h3>
//                     <p
//                       className={`text-sm ${
//                         darkMode ? "text-gray-300" : "text-gray-500"
//                       }`}
//                     >
//                       {customer.email}
//                     </p>
//                   </div>
//                 </div>

//                 <span
//                   className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                     customer.status === "New"
//                       ? "bg-green-100 text-green-600"
//                       : customer.status === "Active"
//                         ? "bg-blue-100 text-blue-600"
//                         : customer.status === "Pending"
//                           ? "bg-orange-100 text-orange-600"
//                           : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   {customer.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
//         {/* Customer Source */}
//         <div
//           className={`lg:col-span-3 p-6 rounded-2xl shadow-sm ${
//             darkMode
//               ? "bg-gray-700 border border-gray-600"
//               : "bg-white border border-gray-100"
//           }`}
//         >
//           <h2
//             className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
//           >
//             Customer Source
//           </h2>

//           <div className="flex items-center justify-between gap-4">
//             <div className="w-[150px] h-[150px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={sourceData}
//                     dataKey="value"
//                     innerRadius={45}
//                     outerRadius={70}
//                     paddingAngle={3}
//                   >
//                     {sourceData.map((entry, index) => (
//                       <Cell key={index} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="space-y-3">
//               {sourceData.map((item, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <span
//                     className="w-3 h-3 rounded-full"
//                     style={{ backgroundColor: item.color }}
//                   ></span>
//                   <div>
//                     <p
//                       className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
//                     >
//                       {item.name}
//                     </p>
//                     <p className="font-semibold">{item.value}%</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Top Customers */}

//         <div
//           className={`lg:col-span-5 p-3 rounded-2xl shadow-sm ${
//             darkMode
//               ? "bg-gray-700 border border-gray-600"
//               : "bg-white border border-gray-100"
//           }`}
//         >
//           <h2
//             className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
//           >
//             Top Customers
//           </h2>

//           {/* Header */}
//           <div
//             className={`grid grid-cols-[2fr_2fr_auto] px-3 py-2 rounded-xl text-sm font-semibold ${
//               darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             <span>Name</span>
//             <span>Email</span>
//             <span className="text-right">Status</span>
//           </div>

//           {/* Rows */}
//           <div className="space-y-3">
//             {customers.slice(0, 4).map((customer) => (
//               <div
//                 key={customer.id}
//                 className={`grid grid-cols-[2fr_2fr_auto] items-center px-3 py-2 rounded-xl transition cursor-pointer ${
//                   darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                 }`}
//               >
//                 {/* Name */}
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 bg-gray-300 rounded-full">
//                     <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-300 shrink-0">
//                       <img
//                         src={customer.image}
//                         alt={customer.name}
//                         className="w-full h-full object-cover object-top"
//                       />
//                     </div>
//                   </div>
//                   <span className="font-medium">{customer.name}</span>
//                 </div>

//                 {/* Email */}
//                 <span
//                   className={`truncate ${
//                     darkMode ? "text-gray-300" : "text-gray-500"
//                   }`}
//                 >
//                   {customer.email}
//                 </span>

//                 {/* Status */}
//                 <span
//                   className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ml-auto ${
//                     customer.status === "New"
//                       ? "bg-green-100 text-green-600"
//                       : customer.status === "Active"
//                         ? "bg-blue-100 text-blue-600"
//                         : customer.status === "Pending"
//                           ? "bg-orange-100 text-orange-600"
//                           : "bg-gray-100 text-gray-500"
//                   }`}
//                 >
//                   {customer.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div
//           className={`lg:col-span-4 p-3 rounded-2xl shadow-sm ${
//             darkMode
//               ? "bg-gray-700 border border-gray-600"
//               : "bg-white border border-gray-100"
//           }`}
//         >
//           <h2
//             className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
//           >
//             Quick Actions
//           </h2>

//           <div className="grid grid-cols-2 gap-2">
//             <button
//               onClick={() => setShowAddModal(true)}
//               className={`p-2 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
//                 darkMode
//                   ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
//                   : "bg-white border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0f766e] text-white flex items-center justify-center">
//                 👤
//               </div>
//               <p
//                 className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
//               >
//                 Add Customer
//               </p>
//             </button>

//             <button
//               onClick={() => navigate("/reports")}
//               className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
//                 darkMode
//                   ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
//                   : "bg-white border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500 text-white flex items-center justify-center">
//                 📄
//               </div>
//               <p
//                 className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
//               >
//                 View Reports
//               </p>
//             </button>

//             <button
//               onClick={() => navigate("/users")}
//               className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
//                 darkMode
//                   ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
//                   : "bg-white border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-yellow-500 text-white flex items-center justify-center">
//                 👥
//               </div>
//               <p
//                 className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
//               >
//                 Manage Users
//               </p>
//             </button>

//             <button
//               onClick={() => navigate("/settings")}
//               className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
//                 darkMode
//                   ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
//                   : "bg-white border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500 text-white flex items-center justify-center">
//                 ⚙️
//               </div>
//               <p
//                 className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
//               >
//                 Settings
//               </p>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useOutletContext } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import CustomerDashboard from "./CustomerDashboard";

export default function Dashboard() {
  const { darkMode, userRole } = useOutletContext();

  switch (userRole) {
    case "Admin":
      return <AdminDashboard darkMode={darkMode} />;
    case "Manager":
      return <ManagerDashboard darkMode={darkMode} />;
    case "Employee":
      return <EmployeeDashboard darkMode={darkMode} />;
    case "Customer":
      return <CustomerDashboard darkMode={darkMode} />;
    default:
      return <div>No dashboard available for this role.</div>;
  }
}

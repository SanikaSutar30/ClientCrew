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

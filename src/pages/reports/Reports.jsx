import { useOutletContext } from "react-router-dom";
import AdminReports from "./AdminReports";
import ManagerReports from "./ManagerReports";
import EmployeeReports from "./EmployeeReports";
import CustomerReports from "./CustomerReports";

export default function Reports() {
  const { darkMode } = useOutletContext();

    // const userRole = "Admin";

  //     const userRole = "Manager";

  // const userRole = "Employee";
    const userRole = "Customer";


  const renderReportsByRole = () => {
    switch (userRole) {
      case "Admin":
        return <AdminReports darkMode={darkMode} />;
      case "Manager":
        return <ManagerReports darkMode={darkMode} />;
      case "Employee":
        return <EmployeeReports darkMode={darkMode} />;
      case "Customer":
        return <CustomerReports darkMode={darkMode} />;
      default:
        return (
          <div
            className={`rounded-2xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            No reports available for this role.
          </div>
        );
    }
  };

  return <>{renderReportsByRole()}</>;
}

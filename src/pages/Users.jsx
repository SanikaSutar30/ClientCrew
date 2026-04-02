import { useOutletContext } from "react-router-dom";

export default function Users() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Users Page
      </h1>
      <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2`}>
        Managers, Employees, and Customers list will come here.
      </p>
    </div>
  );
}

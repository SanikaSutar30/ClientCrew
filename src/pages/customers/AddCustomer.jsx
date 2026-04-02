import { useOutletContext } from "react-router-dom";

export default function AddCustomer() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Add Customer Page
      </h1>
    </div>
  );
}

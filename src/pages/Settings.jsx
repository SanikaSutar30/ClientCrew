import { useOutletContext } from "react-router-dom";

export default function Settings() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Settings Page
      </h1>
    </div>
  );
}

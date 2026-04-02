import { useOutletContext } from "react-router-dom";

export default function Reports() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Reports Page
      </h1>
    </div>
  );
}

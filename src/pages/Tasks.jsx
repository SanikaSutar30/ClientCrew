import { useOutletContext } from "react-router-dom";

export default function Tasks() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Task Page
      </h1>
    </div>
  );
}

import { useOutletContext } from "react-router-dom";

export default function Projects() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
      >
        Project Page
      </h1>
    </div>
  );
}

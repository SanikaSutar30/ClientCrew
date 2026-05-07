import ConfirmationModal from "../../components/layout/ConfirmationModal";

export default function DeleteTask({
  darkMode,
  task,
  showDeleteTask,
  setShowDeleteTask,
  onDeleteTask,
  setShowViewTask,
}) {
  return (
    <ConfirmationModal
      darkMode={darkMode}
      isOpen={showDeleteTask}
      type="error"
      title="Delete Task"
      message={`Are you sure you want to delete ${task?.title || "this task"}?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={() => {
        onDeleteTask(task.id);
        setShowDeleteTask(false);
        setShowViewTask(false);
      }}
      onCancel={() => setShowDeleteTask(false)}
    />
  );
}

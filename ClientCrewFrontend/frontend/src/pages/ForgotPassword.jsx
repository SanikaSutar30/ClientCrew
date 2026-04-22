import { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

export default function ForgotPassword({ setShowForgotModal }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSuccessMessage("Password reset successfully.");

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setShowForgotModal(false);
      setSuccessMessage("");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={() => setShowForgotModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-5">
          Update your password securely
        </p>

        {successMessage ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Lock size={16} className="text-[#0f766e]" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 ${
                    errors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0f766e] cursor-pointer"
                >
                  {showPasswords.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Lock size={16} className="text-[#0f766e]" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0f766e] cursor-pointer"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Lock size={16} className="text-[#0f766e]" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0f766e] cursor-pointer"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f766e] text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition cursor-pointer"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

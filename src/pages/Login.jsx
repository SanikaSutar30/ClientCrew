import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/layout/ConfirmationModal";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin");
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const roles = ["Admin", "Manager", "Employee", "Customer"];

  const highlights = [
    {
      title: "Customer Management",
      icon: Users,
    },
    {
      title: "Project Tracking",
      icon: FolderKanban,
    },
    {
      title: "Task Workflow",
      icon: CheckSquare,
    },
  ];

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowLoginSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <div className="h-screen grid lg:grid-cols-2 overflow-hidden">
        {" "}
        {/* Left Branding Section */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#134e4a] text-white px-10 py-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-12 left-12 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-20 right-16 w-56 h-56 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full max-w-xl">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-14 h-14 bg-white text-[#0f766e] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                  C
                </div>
                <div>
                  <h1 className="text-3xl font-bold">ClientCrew</h1>
                  <p className="text-white/80 text-sm">
                    CRM + Project Management Platform
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
                <ShieldCheck size={16} />
                Smart business workspace
              </div>

              <h2 className="text-[42px] font-bold leading-tight">
                {" "}
                Welcome back to your all-in-one workspace
              </h2>

              <p className="mt-4 text-base text-white/85 leading-7 max-w-lg">
                {" "}
                Manage customers, projects, tasks, and team communication from
                one modern and professional platform.
              </p>

              <div className="mt-6 space-y-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-base">{item.title}</p>
                        <p className="text-sm text-white/75">
                          Smooth, organized, and role-based workflow management
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                <h3 className="text-xl font-bold">256+</h3>
                <p className="text-xs text-white/75 mt-1">Customers</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                <h3 className="text-xl font-bold">12+</h3>
                <p className="text-xs text-white/75 mt-1">Projects</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                <h3 className="text-xl font-bold">4</h3>
                <p className="text-xs text-white/75 mt-1">Roles</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Form Section */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#eef2f7]">
          <div className="w-full max-w-[490px]">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0f766e] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                C
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">ClientCrew</h2>
                <p className="text-sm text-gray-500 -mt-1">
                  CRM + Project Management Platform
                </p>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md p-7 rounded-3xl shadow-2xl border border-white/60">
              <div className="text-center mb-5">
                <h3 className="text-[30px] font-bold text-gray-800 leading-tight">
                  {" "}
                  Login to your account
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Access your dashboard and continue your workflow
                </p>
              </div>

              <form onSubmit={handleLogin} noValidate>
                {/* Email */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-[#0f766e]" />
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="off"
                    className={`w-full mt-1 px-5 py-2.5 border rounded-xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-[#0f766e]" />
                    Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`w-full px-5 py-2.5 pr-12 border rounded-xl bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20 transition ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-[#0f766e] cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <p
                  onClick={() => navigate("/forgot-password")}
                  className="text-right text-sm text-gray-500 mb-3 cursor-pointer hover:text-[#0f766e] hover:underline transition"
                >
                  Forgot password?
                </p>

                {/* Role */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 text-center mb-3">
                    Select Role
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {roles.map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition ${
                          role === r
                            ? "border-[#0f766e] bg-[#e6f4f2] text-[#0f766e] font-medium"
                            : "border-gray-300 bg-white text-gray-600 hover:border-[#0f766e]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          checked={role === r}
                          onChange={() => setRole(r)}
                          className="accent-[#0f766e]"
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#0f766e] text-white py-3 rounded-xl transition font-medium shadow-md mt-4 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 border-t border-gray-200"></div>

              {/* Bottom Links */}
              <p className="text-sm text-center text-gray-500">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-[#0f766e] font-medium cursor-pointer hover:underline"
                >
                  Create Account
                </span>
              </p>

              <p
                onClick={() => navigate("/")}
                className="text-sm text-center text-gray-400 mt-3 cursor-pointer hover:text-[#0f766e] transition"
              >
                ← Back to Home
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLoginSuccess}
        darkMode={false}
        type="success"
        title="Login Successful!"
        message="Welcome back to ClientCrew."
        confirmText="OK"
        onConfirm={() => {
          setShowLoginSuccess(false);
          localStorage.setItem("userRole", role);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}

export default Login;

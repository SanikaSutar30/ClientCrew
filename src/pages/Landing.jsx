import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  FolderKanban,
  CheckSquare,
  Bell,
  BarChart3,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Customer Management",
      description:
        "Manage customers, contact details, profiles, and interactions in one place.",
      icon: Users,
    },
    {
      title: "Project Tracking",
      description:
        "Create, assign, and monitor projects with progress, deadlines, and team members.",
      icon: FolderKanban,
    },
    {
      title: "Task Management",
      description:
        "Organize daily work with smart task boards, priorities, due dates, and status updates.",
      icon: CheckSquare,
    },
    {
      title: "Real-Time Messaging",
      description:
        "Stay connected with your team and clients through built-in communication tools.",
      icon: MessageSquare,
    },
    {
      title: "Reports & Insights",
      description:
        "Analyze customer growth, project status, and business performance with clear reports.",
      icon: BarChart3,
    },
    {
      title: "Notifications & Settings",
      description:
        "Get timely updates, manage alerts, and personalize your workspace easily.",
      icon: Bell,
    },
  ];

  const stats = [
    { value: "256+", label: "Customers Managed" },
    { value: "12+", label: "Projects Active" },
    { value: "18+", label: "Tasks In Progress" },
    { value: "4", label: "User Roles" },
  ];

  return (
    <div className="min-h-screen bg-[#eef2f7] text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0f766e] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
              C
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ClientCrew</h1>
              <p className="text-sm text-gray-500 -mt-1">
                CRM + Project Management Platform
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2.5 rounded-xl bg-[#0f766e] text-white hover:opacity-90 transition shadow-md cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-10">
        <div className="grid xl:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="lg:pr-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6f4f2] text-[#0f766e] text-sm font-medium mb-6">
              <ShieldCheck size={16} />
              Smart business workspace for teams
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Manage customers, projects, tasks, and teams in{" "}
              <span className="text-[#0f766e]">one powerful platform</span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-2xl">
              ClientCrew helps businesses streamline customer relationships,
              organize projects, monitor team progress, and improve
              communication with a modern all-in-one workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 rounded-xl bg-[#0f766e] text-white hover:opacity-90 transition shadow-md cursor-pointer flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Login
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
                >
                  <h3 className="text-2xl font-bold text-[#0f766e]">
                    {item.value}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right Preview */}
          <div className="relative hidden xl:block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f766e]/10 to-transparent blur-3xl rounded-full"></div>

            <div className="relative lg:scale-95 origin-center bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Topbar Preview */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="w-64 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-400">
                  Search customers, projects, tasks...
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-200"></div>
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-200"></div>
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-200"></div>

                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-[#0f766e]/20"></div>
                    <div>
                      <p className="font-semibold text-sm">Admin</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[230px_1fr] min-h-[500px]">
                {/* Sidebar Preview */}
                <div className="bg-gradient-to-b from-[#0f172a] to-[#0b2230] text-white p-5">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-[#0f766e] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      C
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      CRM Manager
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Dashboard",
                      "Customers",
                      "Projects",
                      "Reports",
                      "Tasks",
                      "Notifications",
                      "Settings",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`px-4 py-3 rounded-xl text-lg ${
                          index === 0
                            ? "bg-[#0f766e] text-white"
                            : "text-gray-200 hover:bg-white/10"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 px-4 py-3 rounded-xl border border-white/10 text-gray-200">
                    Logout
                  </div>
                </div>

                {/* Main Preview */}
                <div className="p-5 bg-[#f8fafc]">
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    Dashboard
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Welcome back, Admin! Here's what's happening with your
                    workspace.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-5">
                    {[
                      { label: "Total Customers", value: "256" },
                      { label: "New Customers", value: "12" },
                      { label: "Active Customers", value: "231" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                      >
                        <p className="text-sm text-gray-500">{card.label}</p>
                        <h4 className="text-3xl font-bold mt-2 text-gray-900">
                          {card.value}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-2xl font-bold">Customer Growth</h4>
                        <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
                          Monthly
                        </div>
                      </div>

                      <div className="h-56 rounded-2xl bg-gradient-to-b from-[#0f766e]/10 to-transparent border border-dashed border-gray-200 flex items-end p-4 gap-4">
                        {[70, 120, 140, 160, 210, 250].map((h, i) => (
                          <div key={i} className="flex-1 flex items-end">
                            <div
                              className="w-full rounded-t-xl bg-[#0f766e]/70"
                              style={{ height: `${h}px` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                      <h4 className="text-2xl font-bold mb-4">
                        Recent Customers
                      </h4>

                      <div className="space-y-4">
                        {[
                          "Rahul Sharma",
                          "Amit Patil",
                          "Priya Singh",
                          "John Doe",
                        ].map((name, i) => (
                          <div
                            key={name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#0f766e]/20"></div>
                              <div>
                                <p className="font-medium">{name}</p>
                                <p className="text-xs text-gray-500">
                                  customer{i + 1}@mail.com
                                </p>
                              </div>
                            </div>

                            <span className="text-xs px-3 py-1 rounded-full bg-[#e6f4f2] text-[#0f766e]">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right end */}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900">
            Everything your team needs
          </h3>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            ClientCrew combines CRM, task tracking, reporting, communication,
            and project collaboration into one simple and professional system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#e6f4f2] text-[#0f766e] flex items-center justify-center mb-4">
                  <Icon size={28} />
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h4>

                <p className="text-gray-600 leading-7">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-gradient-to-r from-[#0f766e] to-[#115e59] rounded-3xl text-white p-10 md:p-14 shadow-xl">
          <div className="max-w-3xl">
            <h3 className="text-4xl font-bold leading-tight">
              Ready to simplify customer and project management?
            </h3>
            <p className="mt-4 text-lg text-white/90 leading-8">
              Start building your workflow with ClientCrew and manage your team,
              tasks, customers, and reports from one place.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-8 px-6 py-3 rounded-xl bg-white text-[#0f766e] font-semibold hover:bg-gray-100 transition cursor-pointer inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const sidebarByRole = {
  Admin: [
    {
      title: "MAIN",
      items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Customers", path: "/customers", icon: Users },
        { name: "Projects", path: "/projects", icon: FolderKanban },
        { name: "Users", path: "/users", icon: ShieldCheck },
        { name: "Tasks", path: "/tasks", icon: CheckSquare },
        { name: "Employees / Teams", path: "/employees", icon: UserCog },
      ],
    },
    {
      title: "INSIGHTS",
      items: [{ name: "Reports", path: "/reports", icon: BarChart3 }],
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Notifications", path: "/notifications", icon: Bell },
        { name: "Settings", path: "/settings", icon: Settings },
      ],
    },
  ],

  Manager: [
    {
      title: "MAIN",
      items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Customers", path: "/customers", icon: Users },
        { name: "Projects", path: "/projects", icon: FolderKanban },
        { name: "Tasks", path: "/tasks", icon: CheckSquare },
        { name: "Employees / Teams", path: "/employees", icon: UserCog },
      ],
    },
    {
      title: "INSIGHTS",
      items: [{ name: "Reports", path: "/reports", icon: BarChart3 }],
    },
    {
      title: "SYSTEM",
      items: [{ name: "Notifications", path: "/notifications", icon: Bell }],
    },
  ],

  Employee: [
    {
      title: "MAIN",
      items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
    },
    {
      title: "WORKSPACE",
      items: [
        { name: "Customers", path: "/customers", icon: Users },
        { name: "Projects", path: "/projects", icon: FolderKanban },
        { name: "Tasks", path: "/tasks", icon: CheckSquare },
        { name: "Employees / Teams", path: "/employees", icon: UserCog },
      ],
    },
    {
      title: "INSIGHTS",
      items: [{ name: "Reports", path: "/reports", icon: BarChart3 }],
    },
    {
      title: "SYSTEM",
      items: [{ name: "Notifications", path: "/notifications", icon: Bell }],
    },
  ],

  Customer: [
    {
      title: "MAIN",
      items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
    },
    {
      title: "CLIENT AREA",
      items: [
        { name: "Projects", path: "/projects", icon: FolderKanban },
        { name: "Employees / Teams", path: "/employees", icon: UserCog },
        { name: "Reports", path: "/reports", icon: BarChart3 },
      ],
    },
    {
      title: "SYSTEM",
      items: [{ name: "Notifications", path: "/notifications", icon: Bell }],
    },
  ],
};

export const routeAccess = {
  dashboard: ["Admin", "Manager", "Employee", "Customer"],
  customers: ["Admin", "Manager", "Employee"],
  projects: ["Admin", "Manager", "Employee", "Customer"],
  tasks: ["Admin", "Manager", "Employee"],
  employees: ["Admin", "Manager", "Employee", "Customer"],
  reports: ["Admin", "Manager", "Employee", "Customer"],
  notifications: ["Admin", "Manager", "Employee", "Customer"],
  settings: ["Admin"],
  messages: ["Admin", "Manager", "Employee", "Customer"],
  profile: ["Admin", "Manager", "Employee", "Customer"],
  helpSupport: ["Admin", "Manager", "Employee", "Customer"],
  users: ["Admin"],
};
export const normalizeRole = (role) => {
  const roleMap = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    EMPLOYEE: "Employee",
    CUSTOMER: "Customer",
  };

  return roleMap[role] || role;
};

export const getUserRole = () => {
  return normalizeRole(localStorage.getItem("userRole"));
};

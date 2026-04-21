import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Landing from "../pages/Landing";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/customers/Customers";
import Projects from "../pages/projects/Projects";
import Tasks from "../pages/tasks/Tasks";
import Employees from "../pages/employees/Employees";
import Reports from "../pages/reports/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MyProfile from "../pages/MyProfile";
import HelpSupport from "../pages/HelpSupport";
import Messages from "../pages/messages/Messages";
import UsersPage from "../pages/users/UsersPage";

// Customer Actions
import AddCustomer from "../pages/customers/AddCustomer";
import EditCustomer from "../pages/customers/EditCustomer";
import DeleteCustomer from "../pages/customers/DeleteCustomer";
import ViewCustomer from "../pages/customers/ViewCustomer";

// Project Actions
import AddProject from "../pages/projects/AddProject";
import EditProject from "../pages/projects/EditProject";
import ViewProject from "../pages/projects/ViewProject";
import ProjectSettings from "../pages/projects/ProjectSettings";

import ProtectedRoute from "../components/layout/ProtectedRoute";
import { routeAccess } from "../utils/roleAccess";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Layout */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={routeAccess.dashboard}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Customers */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={routeAccess.customers}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/add"
            element={
              <ProtectedRoute allowedRoles={routeAccess.customers}>
                <AddCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/edit/:id"
            element={
              <ProtectedRoute allowedRoles={routeAccess.customers}>
                <EditCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/view/:id"
            element={
              <ProtectedRoute allowedRoles={routeAccess.customers}>
                <ViewCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/delete/:id"
            element={
              <ProtectedRoute allowedRoles={routeAccess.customers}>
                <DeleteCustomer />
              </ProtectedRoute>
            }
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={routeAccess.projects}>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/settings"
            element={
              <ProtectedRoute allowedRoles={routeAccess.projects}>
                <ProjectSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/add"
            element={
              <ProtectedRoute allowedRoles={routeAccess.projects}>
                <AddProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/edit/:id"
            element={
              <ProtectedRoute allowedRoles={routeAccess.projects}>
                <EditProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/view/:id"
            element={
              <ProtectedRoute allowedRoles={routeAccess.projects}>
                <ViewProject />
              </ProtectedRoute>
            }
          />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute allowedRoles={routeAccess.tasks}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          {/* Messages */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={routeAccess.messages}>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute allowedRoles={routeAccess.employees}>
                <Employees />
              </ProtectedRoute>
            }
          />

          {/* Users */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={routeAccess.users}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Others */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={routeAccess.reports}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={routeAccess.notifications}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={routeAccess.settings}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={routeAccess.profile}>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-support"
            element={
              <ProtectedRoute allowedRoles={routeAccess.helpSupport}>
                <HelpSupport />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

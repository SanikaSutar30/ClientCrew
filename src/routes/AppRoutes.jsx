import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/customers/Customers";
import Projects from "../pages/projects/Projects";
import Tasks from "../pages/tasks/Tasks";
import Employees from "../pages/Employees";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Register from "../pages/Register";
import MyProfile from "../pages/MyProfile";
import HelpSupport from "../pages/HelpSupport";
import Messages from "../pages/messages/Messages";

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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Customers */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/customers/view/:id" element={<ViewCustomer />} />
          <Route path="/customers/delete/:id" element={<DeleteCustomer />} />

          {/* Projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/settings" element={<ProjectSettings />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/view/:id" element={<ViewProject />} />
        

          {/* Tasks */}
          <Route path="/tasks" element={<Tasks />} />

          {/* Messages (FIXED POSITION) */}
          <Route path="/messages" element={<Messages />} />

          {/* Others */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/help-support" element={<HelpSupport />} />
        </Route>

        {/* Auth */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

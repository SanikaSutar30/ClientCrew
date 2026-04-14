import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/customers/Customers";
import AddCustomer from "../pages/customers/AddCustomer";
import Projects from "../pages/projects/Projects";
import Tasks from "../pages/tasks/Tasks";
import Employees from "../pages/Employees";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Register from "../pages/Register";
import MyProfile from "../pages/MyProfile";
import HelpSupport from "../pages/HelpSupport";

import AddProject from "../pages/projects/AddProject";
import EditProject from "../pages/projects/EditProject";
import ViewProject from "../pages/projects/ViewProject";
import DeleteProject from "../pages/projects/DeleteProject";
import ProjectSettings from "../pages/projects/ProjectSettings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/settings" element={<ProjectSettings />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/view/:id" element={<ViewProject />} />
          <Route path="/projects/delete/:id" element={<DeleteProject />} />

          <Route path="/tasks" element={<Tasks />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/help-support" element={<HelpSupport />} />
        </Route>

        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}


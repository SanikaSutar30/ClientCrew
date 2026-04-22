import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout, ProtectedRoute } from "../components/layout";
import {
  Landing,
  Login,
  Register,
  Dashboard,
  Customers,
  AddCustomer,
  EditCustomer,
  DeleteCustomer,
  ViewCustomer,
  Projects,
  Tasks,
  Employees,
  Reports,
  Notifications,
  Settings,
  MyProfile,
  HelpSupport,
  Messages,
  UsersPage,
} from "../pages";

import { routeAccess } from "../utils/roleAccess";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected App Routes */}
        <Route element={<Layout />}>
          {/* Dashboard */}
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

          {/* Reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={routeAccess.reports}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={routeAccess.notifications}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={routeAccess.settings}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* My Profile */}
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={routeAccess.profile}>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* Help Support */}
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

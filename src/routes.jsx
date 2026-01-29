import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import Dashboard from "./pages/admin/Dashboard";
import CheckIn from "./pages/employee/CheckIn";

import AppShell from "./App";
import MyTasks from "./pages/employee/MyTasks";
import Tasks from "./pages/admin/Tasks";


export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  { 
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      
      {
        path: "employee/checkin",
        element: (
          <RoleRoute allow={["employee"]}>
            <CheckIn />
          </RoleRoute>
        ),
      },
      {
        path: "employee/tasks",
        element: (
          <RoleRoute allow={["employee"]}>
            <MyTasks />
          </RoleRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <RoleRoute allow={["admin"]}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      {
        path: "admin/tasks",
        element: (
          <RoleRoute allow={["admin"]}>
            <Tasks />
          </RoleRoute>
        ),
      },
    ],
  },
]);

import { Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../features/auth/RegisterPage"
import WelcomePage from "../features/auth/WelcomePage"
import GoogleCallback from "../features/auth/GoogleCallback"

import ProtectedRoute from "../components/layout/ProtectedRoute"
import DashboardLayout from "../components/layout/DashboardLayout"

import DashboardPage from "../pages/DashboardPage"
import AgentsPage from "../features/agents/AgentsPage"

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />

      {/* Welcome (keep separate for now) */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AgentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}
import { Routes, Route, Navigate } from "react-router-dom"
// import LoginPage from "../features/auth/LoginPage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../features/auth/RegisterPage"
import WelcomePage from "../features/auth/WelcomePage"
import ProtectedRoute from "../components/layout/ProtectedRoute"
import GoogleCallback from "../features/auth/GoogleCallback"
export default function AppRouter() {
  return (
    <Routes>
      {/* Default Route */}
      {/* <Route path="/" element={<LoginPage />} /> */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Welcome Page */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */} 

    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/auth/callback" element={<GoogleCallback />} />
    </Routes>
  )
}
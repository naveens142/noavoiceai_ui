import { Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "../pages/LoginPage"
import RegisterPage from "../features/auth/RegisterPage"
import WelcomePage from "../features/auth/WelcomePage"
import GoogleCallback from "../features/auth/GoogleCallback"

import ProtectedRoute from "../components/layout/ProtectedRoute"
import DashboardLayout from "../components/layout/DashboardLayout"

import DashboardPage from "../pages/DashboardPage"
import AgentsPage from "../features/agents/AgentsPage"
import AgentDetailsPage from "../features/agents/AgentDetailsPage"
import ActionsPage from "../features/agents/pages/ActionsPage"
import ToolsPage from "../pages/ToolsPage"
import KnowledgeBasePage from "../pages/KnowledgeBasePage"
import CampaignsPage from "../pages/CampaignsPage"
import PhoneNumbersPage from "../pages/PhoneNumbersPage"
import CallLogsPage from "../pages/CallLogsPage"
import AnalyticsPage from "../pages/AnalyticsPage"
import SettingsPage from "../pages/SettingsPage"
import TestConnectionPage from "../pages/TestConnectionPage"

export default function AppRouter() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/test-connection" element={<TestConnectionPage />} />

      {/* Welcome */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard Home */}
        <Route index element={<DashboardPage />} />

        {/* Agents List */}
        <Route path="agents" element={<AgentsPage />} />

        {/* Agent Details */}
        <Route path="agents/:agentId" element={<AgentDetailsPage />} />

        {/* Actions */}
        <Route path="actions" element={<ActionsPage />} />

        {/* Tools */}
        <Route path="tools" element={<ToolsPage />} />

        {/* Knowledge Base */}
        <Route path="knowledge" element={<KnowledgeBasePage />} />

        {/* Campaigns */}
        <Route path="campaigns" element={<CampaignsPage />} />

        {/* Phone Numbers */}
        <Route path="numbers" element={<PhoneNumbersPage />} />

        {/* Call Logs */}
        <Route path="calls" element={<CallLogsPage />} />

        {/* Analytics */}
        <Route path="analytics" element={<AnalyticsPage />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  )
}
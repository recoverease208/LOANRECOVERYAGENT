import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PublicInfoPage } from "@/pages/PublicInfoPage";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { BorrowersPage } from "@/pages/BorrowersPage";
import { LoansPage } from "@/pages/LoansPage";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { OtpVerificationPage } from "@/pages/OtpVerificationPage";
import { CommunicationsPage } from "@/pages/CommunicationsPage";
import { AiAssistantPage } from "@/pages/AiAssistantPage";
import { OperationsPage } from "@/pages/OperationsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { UsersPage } from "@/pages/UsersPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<PublicInfoPage kind="about" />} />
        <Route path="features" element={<PublicInfoPage kind="features" />} />
        <Route path="solutions" element={<PublicInfoPage kind="solutions" />} />
        <Route path="pricing" element={<PublicInfoPage kind="pricing" />} />
        <Route path="contact" element={<PublicInfoPage kind="contact" />} />
        <Route path="demo" element={<PublicInfoPage kind="demo" />} />
      </Route>
      <Route path="login" element={<AuthPage mode="admin" />} />
      <Route path="staff-login" element={<AuthPage mode="staff" />} />
      <Route path="borrower-login" element={<AuthPage mode="borrower" />} />
      <Route path="otp" element={<OtpVerificationPage />} />
      <Route path="forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="reset-password" element={<AuthPage mode="reset" />} />
      <Route path="app" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="borrowers" element={<BorrowersPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="emi-tracking" element={<OperationsPage title="EMI Tracking" />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="escalations" element={<OperationsPage title="Escalation Management" />} />
        <Route path="ai-assistant" element={<AiAssistantPage />} />
        <Route path="communication" element={<CommunicationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

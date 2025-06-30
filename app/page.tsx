"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/login-page"
import { TopNavigation } from "@/components/top-navigation"
import { Sidebar } from "@/components/sidebar"
import { AccountOverview } from "@/components/account-overview"
import { TransferPanel } from "@/components/transfer-panel"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { ReportsPanel } from "@/components/reports-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { OperatorDashboard } from "@/components/operator-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { RegisterUserPanel } from "@/components/register-user-panel"
import { OperatorCashDeposits } from "@/components/operator-cash-deposits"
import { OperatorWithdrawals } from "@/components/operator-withdrawals"
import { FraudReportingPanel } from "@/components/fraud-reporting-panel"
import { AIPullUpMenu } from "@/components/ai-pull-up-menu"
import { NotificationSystem } from "@/components/notification-system"

function DashboardContent() {
  const { user, isLoading } = useAuth()
  const [activePanel, setActivePanel] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (user?.role === "operator") {
      setActivePanel("operator-dashboard")
    } else if (user?.role === "admin") {
      setActivePanel("admin-dashboard")
    } else {
      setActivePanel("dashboard")
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading DigiPesa...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const renderActivePanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <AccountOverview />
      case "transfer":
        return <TransferPanel />
      case "analytics":
        return <AnalyticsPanel />
      case "reports":
        return <ReportsPanel />
      case "settings":
        return <SettingsPanel />
      case "operator-dashboard":
        return <OperatorDashboard />
      case "admin-dashboard":
        return <AdminDashboard />
      case "register-user":
        return <RegisterUserPanel />
      case "cash-deposits":
        return <OperatorCashDeposits />
      case "withdrawals":
        return <OperatorWithdrawals />
      case "fraud-reporting":
        return <FraudReportingPanel />
      default:
        return <AccountOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TopNavigation onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-4 lg:p-6">{renderActivePanel()}</div>
        </main>
      </div>

      <AIPullUpMenu />
      <NotificationSystem />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}

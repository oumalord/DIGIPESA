"use client"

import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  Send,
  Download,
  ShoppingCart,
  PiggyBank,
  CreditCard,
  AlertTriangle,
  Settings,
  Users,
  UserPlus,
  DollarSign,
  ArrowDownLeft,
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
  Bot,
  Briefcase,
  Activity,
  UserCog,
} from "lucide-react"

interface SidebarProps {
  activePanel: string
  setActivePanel: (panel: string) => void
}

export function Sidebar({ activePanel, setActivePanel }: SidebarProps) {
  const { user } = useAuth()

  if (!user) return null

  const getUserMenuItems = () => [
    { id: "account-overview", label: "Account Overview", icon: Home },
    { id: "transfer", label: "Transfer Money", icon: Send },
    { id: "withdraw", label: "Withdraw", icon: Download },
    { id: "purchase", label: "Purchase", icon: ShoppingCart },
    { id: "savings", label: "Savings", icon: PiggyBank },
    { id: "loan-application", label: "Apply for Loan", icon: CreditCard },
    { id: "fraud-reporting", label: "Report Fraud", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const getOperatorMenuItems = () => [
    { id: "operator-dashboard", label: "Dashboard", icon: Home },
    { id: "register-user", label: "Register User", icon: UserPlus },
    { id: "cash-deposits", label: "Cash Deposits", icon: DollarSign },
    { id: "process-withdrawals", label: "Process Withdrawals", icon: ArrowDownLeft },
    { id: "user-management", label: "User Management", icon: Users },
    { id: "fraud-reporting", label: "Report Fraud", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const getAdminMenuItems = () => [
    { id: "admin-dashboard", label: "Admin Dashboard", icon: Home },
    { id: "admin-user-management", label: "User Management", icon: UserCog },
    { id: "admin-fraud-management", label: "Fraud Management", icon: Shield },
    { id: "system-dashboard", label: "System Dashboard", icon: Activity },
    { id: "approve-deposits", label: "Approve Deposits", icon: DollarSign },
    { id: "fraud-detection", label: "Fraud Detection", icon: AlertTriangle },
    { id: "credit-score", label: "Credit Scoring", icon: TrendingUp },
    { id: "budget-coach", label: "Budget Coach", icon: Bot },
    { id: "loan-adviser", label: "Loan Adviser", icon: Briefcase },
    { id: "loan-management", label: "Loan Management", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const getMenuItems = () => {
    switch (user.role) {
      case "user":
        return getUserMenuItems()
      case "operator":
        return getOperatorMenuItems()
      case "admin":
        return getAdminMenuItems()
      default:
        return getUserMenuItems()
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed left-0 top-16 bottom-0 w-16 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 shadow-lg z-40">
        <div className="flex flex-col items-center py-4 space-y-4">
          {menuItems.slice(0, 6).map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  activePanel === item.id
                    ? "bg-blue-100 text-blue-600 shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 shadow-lg z-40">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              {user.role === "admin" ? "Admin Panel" : user.role === "operator" ? "Operator Panel" : "Dashboard"}
            </h2>
            <div className="text-sm text-slate-500">Level {user.clearanceLevel} Access</div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activePanel === item.id
                      ? "bg-blue-100 text-blue-600 shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

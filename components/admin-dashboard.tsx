"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getAllUsers, getAllFraudReports, getFlaggedAccounts } from "@/lib/database"
import { Shield, Users, AlertTriangle, UserPlus, ArrowDownToLine, ArrowUpFromLine, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdminDashboard() {
  const { user } = useAuth()
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    flaggedUsers: 0,
    pendingReports: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    const users = getAllUsers()
    const userAccounts = users.filter((u) => u.role === "user")
    const activeUsers = userAccounts.filter((u) => u.accountStatus === "active")
    const flaggedUsers = getFlaggedAccounts()
    const fraudReports = getAllFraudReports()
    const pendingReports = fraudReports.filter((r) => r.status === "pending")

    setSystemStats({
      totalUsers: userAccounts.length,
      activeUsers: activeUsers.length,
      flaggedUsers: flaggedUsers.length,
      pendingReports: pendingReports.length,
    })
  }, [])

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Admin Overview */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="text-xl font-semibold">Administrator Panel</h3>
                <p className="text-blue-100 text-sm">Limited administrative access</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Administrator</div>
              <div className="text-lg font-semibold">{user?.name}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Security Clearance</div>
              <div className="text-xl font-semibold">Level {user?.clearanceLevel}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Access Level</div>
              <div className="text-xl font-semibold">LIMITED</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Role</div>
              <div className="text-xl font-semibold">ADMIN</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Status</div>
              <div className="text-xl font-semibold">ACTIVE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.totalUsers}</p>
                <p className="text-xs text-blue-600">Registered accounts</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Users</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.activeUsers}</p>
                <p className="text-xs text-green-600">Currently active</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Flagged Users</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.flaggedUsers}</p>
                <p className="text-xs text-red-600">Require attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Reports</p>
                <p className="text-2xl font-bold text-slate-800">{systemStats.pendingReports}</p>
                <p className="text-xs text-orange-600">Need review</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Administrative Functions</h3>
              <p className="text-sm text-slate-500">Available admin operations</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center">
              <UserPlus className="w-6 h-6 mb-2" />
              <span className="text-sm">Register New User</span>
            </Button>
            <Button className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center">
              <ArrowDownToLine className="w-6 h-6 mb-2" />
              <span className="text-sm">Process Deposits</span>
            </Button>
            <Button className="h-20 bg-orange-600 hover:bg-orange-700 text-white flex flex-col items-center justify-center">
              <ArrowUpFromLine className="w-6 h-6 mb-2" />
              <span className="text-sm">Process Withdrawals</span>
            </Button>
            <Button className="h-20 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center">
              <AlertTriangle className="w-6 h-6 mb-2" />
              <span className="text-sm">Report Fraud</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Access Restrictions Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800 mb-2">Administrator Access Restrictions</div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You can register new users and collect registration fees</li>
                <li>• You can process cash deposits when customers provide cash</li>
                <li>• You can process withdrawals but customers must provide their PIN</li>
                <li>• You can report suspicious accounts for fraud investigation</li>
                <li>• You cannot access user account balances or transaction history</li>
                <li>• You cannot perform transfers or other financial operations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllFraudReports,
  updateFraudReport,
  flagAccountFromReport,
  getFlaggedAccounts,
  getHighRiskAccounts,
  getAllSecurityAlerts,
  updateSecurityAlert,
  getUserById,
} from "@/lib/database"
import { AlertTriangle, Shield, CheckCircle, Flag, Eye, UserX, Activity, TrendingUp, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminFraudManagement() {
  const { user } = useAuth()
  const [fraudReports, setFraudReports] = useState([])
  const [flaggedAccounts, setFlaggedAccounts] = useState([])
  const [highRiskAccounts, setHighRiskAccounts] = useState([])
  const [securityAlerts, setSecurityAlerts] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setFraudReports(getAllFraudReports())
    setFlaggedAccounts(getFlaggedAccounts())
    setHighRiskAccounts(getHighRiskAccounts())
    setSecurityAlerts(getAllSecurityAlerts())
  }

  const handleFlagAccount = async (reportId: string, reason: string) => {
    if (!user) return

    const success = flagAccountFromReport(reportId, user.id, reason)
    if (success) {
      loadData()
      alert("Account has been flagged for 12 hours")
    } else {
      alert("Failed to flag account")
    }
  }

  const handleUpdateReportStatus = (reportId: string, status: string, actionTaken?: string) => {
    updateFraudReport(reportId, {
      status,
      reviewedBy: user?.id,
      reviewDate: new Date(),
      actionTaken,
    })
    loadData()
  }

  const handleUpdateAlert = (alertId: string, status: string) => {
    updateSecurityAlert(alertId, {
      status,
      assignedTo: user?.id,
    })
    loadData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "investigating":
        return "text-blue-600 bg-blue-100"
      case "resolved":
        return "text-green-600 bg-green-100"
      case "flagged":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "text-green-600 bg-green-100"
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100"
      case "HIGH":
        return "text-red-600 bg-red-100"
      case "CRITICAL":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "text-green-600 bg-green-100"
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100"
      case "HIGH":
        return "text-red-600 bg-red-100"
      case "CRITICAL":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  const filteredReports = fraudReports.filter((report) => {
    const matchesSearch =
      report.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesRisk = riskFilter === "all" || report.riskLevel === riskFilter
    return matchesSearch && matchesStatus && matchesRisk
  })

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border border-red-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Reports</p>
                <p className="text-2xl font-bold text-red-600">
                  {fraudReports.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-orange-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Flagged Accounts</p>
                <p className="text-2xl font-bold text-orange-600">{flaggedAccounts.length}</p>
              </div>
              <Flag className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-purple-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">High Risk Accounts</p>
                <p className="text-2xl font-bold text-purple-600">{highRiskAccounts.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-blue-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Alerts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {securityAlerts.filter((a) => a.status === "active").length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search reports by account ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="flagged">Flagged</option>
              </select>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Reports */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Fraud Reports</h3>
              <p className="text-sm text-slate-500">Review and manage fraud reports</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const reporter = getUserById(report.reportedBy)
              return (
                <div key={report.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-slate-800">Account {report.accountId}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(report.riskLevel)}`}
                          >
                            {report.riskLevel}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                          >
                            {report.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{report.description}</div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Amount: {formatCurrency(report.amount)}</span>
                          <span>
                            Reported by: {reporter?.name} ({report.reporterRole})
                          </span>
                          <span>Date: {report.reportDate.toLocaleDateString()}</span>
                          {report.transactionId && <span>TXN: {report.transactionId}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {report.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateReportStatus(report.id, "investigating")}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleFlagAccount(report.id, "Flagged due to fraud report")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            Flag Account
                          </Button>
                        </>
                      )}
                      {report.status === "investigating" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateReportStatus(report.id, "resolved", "Investigation completed")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  {report.actionTaken && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Action Taken:</div>
                      <div className="text-sm text-blue-700">{report.actionTaken}</div>
                      {report.reviewedBy && report.reviewDate && (
                        <div className="text-xs text-blue-600 mt-1">
                          Reviewed by {getUserById(report.reviewedBy)?.name} on {report.reviewDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No fraud reports found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flagged Accounts */}
      <Card className="bg-white/70 backdrop-blur-sm border border-orange-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Flagged Accounts</h3>
              <p className="text-sm text-slate-500">Accounts currently under restriction</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flaggedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="flex items-center space-x-4">
                  <UserX className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-slate-800">{account.name}</div>
                    <div className="text-sm text-slate-600">{account.email}</div>
                    <div className="text-xs text-slate-500">
                      Flagged until: {account.flaggedUntil?.toLocaleString()}
                    </div>
                    {account.flaggedReason && (
                      <div className="text-xs text-orange-600">Reason: {account.flaggedReason}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">
                    Balance: {formatCurrency(account.accountBalance)}
                  </div>
                  <div className="text-xs text-slate-500">ID: {account.nationalId}</div>
                </div>
              </div>
            ))}
            {flaggedAccounts.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No flagged accounts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="bg-white/70 backdrop-blur-sm border border-blue-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Security Alerts</h3>
              <p className="text-sm text-slate-500">System-generated security notifications</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.slice(0, 10).map((alert) => {
              const user = getUserById(alert.userId)
              return (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.severity === "CRITICAL"
                          ? "bg-purple-100"
                          : alert.severity === "HIGH"
                            ? "bg-red-100"
                            : alert.severity === "MEDIUM"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                      }`}
                    >
                      <Shield
                        className={`w-4 h-4 ${
                          alert.severity === "CRITICAL"
                            ? "text-purple-600"
                            : alert.severity === "HIGH"
                              ? "text-red-600"
                              : alert.severity === "MEDIUM"
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-800">{alert.message}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{alert.details}</div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>User: {user?.name}</span>
                        <span>Type: {alert.alertType}</span>
                        <span>Time: {alert.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {alert.status === "active" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateAlert(alert.id, "investigating")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Investigate
                      </Button>
                    )}
                    {alert.status === "investigating" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateAlert(alert.id, "resolved")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
            {securityAlerts.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No security alerts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

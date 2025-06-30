"use client"

import { useState, useEffect } from "react"
import { getAllUsers, getDepositRequests, approveDeposit, flagUser } from "@/lib/database"
import { Users, CheckCircle, AlertTriangle, DollarSign, Eye, Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function OperatorDashboard() {
  const [users, setUsers] = useState([])
  const [depositRequests, setDepositRequests] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    setUsers(getAllUsers().filter((u) => u.role === "user"))
    setDepositRequests(getDepositRequests())
  }, [])

  const handleApproveDeposit = (depositId: string) => {
    approveDeposit(depositId, "operator")
    setDepositRequests(getDepositRequests())
  }

  const handleFlagUser = (userId: string) => {
    flagUser(userId, "operator")
    setUsers(getAllUsers().filter((u) => u.role === "user"))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Operator Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Deposits</p>
                <p className="text-2xl font-bold text-slate-800">
                  {depositRequests.filter((d) => d.status === "pending").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Flagged Accounts</p>
                <p className="text-2xl font-bold text-slate-800">
                  {users.filter((u) => u.accountStatus === "flagged").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Deposits</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(depositRequests.reduce((sum, d) => sum + d.amount, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">User Management</h3>
              <p className="text-sm text-slate-500">View and manage user accounts</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Balance</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{formatCurrency(user.accountBalance)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.accountStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : user.accountStatus === "flagged"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.accountStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          className="bg-transparent border-slate-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFlagUser(user.id)}
                          className="bg-transparent border-red-300 text-red-600"
                          disabled={user.accountStatus === "flagged"}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Deposits */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Pending Deposits</h3>
              <p className="text-sm text-slate-500">Approve user deposit requests</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {depositRequests
              .filter((d) => d.status === "pending")
              .map((deposit) => {
                const user = users.find((u) => u.id === deposit.userId)
                return (
                  <div key={deposit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{user?.name}</div>
                        <div className="text-sm text-slate-500">
                          {formatCurrency(deposit.amount)} via {deposit.method}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveDeposit(deposit.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-red-300 text-red-600">
                        Reject
                      </Button>
                    </div>
                  </div>
                )
              })}
            {depositRequests.filter((d) => d.status === "pending").length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No pending deposits</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

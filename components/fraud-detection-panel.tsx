"use client"

import { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "./recharts-wrapper"
import { AlertTriangle, Shield, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FraudDetectionPanelProps {
  addNotification: (notification: any) => void
}

export function FraudDetectionPanel({ addNotification }: FraudDetectionPanelProps) {
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  const fraudData = [
    { time: "00:00", suspicious: 12, normal: 145 },
    { time: "04:00", suspicious: 8, normal: 132 },
    { time: "08:00", suspicious: 23, normal: 189 },
    { time: "12:00", suspicious: 45, normal: 234 },
    { time: "16:00", suspicious: 67, normal: 198 },
    { time: "20:00", suspicious: 34, normal: 167 },
  ]

  const riskAccounts = [
    { id: "#4521", risk: "HIGH", amount: "$2,450", location: "Unknown IP", confidence: "94%" },
    { id: "#7832", risk: "MEDIUM", amount: "$890", location: "New Device", confidence: "76%" },
    { id: "#9156", risk: "HIGH", amount: "$5,200", location: "Foreign Country", confidence: "89%" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev + 1) % 100)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const reportFraud = (accountId: string) => {
    addNotification({
      type: "fraud",
      message: `Account ${accountId} flagged for review - Security team notified`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Real-time Scanner */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Real-Time Fraud Detection</h3>
                <p className="text-sm text-slate-500">Continuous monitoring and threat assessment</p>
              </div>
            </div>
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                isScanning ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-sm font-medium">{isScanning ? "Active" : "Inactive"}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-800">1,247</div>
              <div className="text-sm text-slate-500">Accounts Monitored</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <div className="text-sm text-slate-500">Flagged Transactions</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">5</div>
              <div className="text-sm text-slate-500">High Risk Alerts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <div className="text-sm text-slate-500">Detection Accuracy</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700">System Scan Progress</span>
              <span className="text-sm text-slate-500">{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>

          <div className="h-64 bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Transaction Activity (24h)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Area type="monotone" dataKey="normal" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* High Risk Accounts */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">High Risk Accounts</h3>
              <p className="text-sm text-slate-500">Accounts requiring immediate attention</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      account.risk === "HIGH" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {account.risk} RISK
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{account.id}</div>
                    <div className="text-sm text-slate-500">{account.location}</div>
                  </div>
                  <div className="text-lg font-bold text-slate-800">{account.amount}</div>
                  <div className="text-sm text-slate-500">
                    Confidence: <span className="font-medium">{account.confidence}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  <Button
                    onClick={() => reportFraud(account.id)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Flag Account
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

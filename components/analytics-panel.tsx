"use client"

import { useAuth } from "@/contexts/auth-context"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "./recharts-wrapper"
import { BarChart3, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsPanel() {
  const { user } = useAuth()

  const analyticsData = [
    { month: "Jan", transactions: 1240, fraudDetected: 12, accuracy: 98.2 },
    { month: "Feb", transactions: 1180, fraudDetected: 8, accuracy: 98.7 },
    { month: "Mar", transactions: 1350, fraudDetected: 15, accuracy: 97.9 },
    { month: "Apr", transactions: 1420, fraudDetected: 18, accuracy: 98.5 },
    { month: "May", transactions: 1380, fraudDetected: 14, accuracy: 99.1 },
    { month: "Jun", transactions: 1450, fraudDetected: 11, accuracy: 99.3 },
  ]

  const performanceMetrics = [
    { metric: "Detection Rate", value: "99.3%", change: "+0.8%", positive: true },
    { metric: "False Positives", value: "0.7%", change: "-0.3%", positive: true },
    { metric: "Response Time", value: "1.2s", change: "-0.4s", positive: true },
    { metric: "System Uptime", value: "99.9%", change: "+0.1%", positive: true },
  ]

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Analytics Header */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">System Analytics</h3>
              <p className="text-sm text-slate-500">Performance metrics and insights</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-xl lg:text-2xl font-bold text-slate-800">{metric.value}</div>
                <div className="text-sm text-slate-500 mb-1">{metric.metric}</div>
                <div className={`text-xs font-medium ${metric.positive ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Transaction Volume</h3>
                <p className="text-sm text-slate-500">Monthly processing statistics</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Bar dataKey="transactions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Detection Accuracy</h3>
                <p className="text-sm text-slate-500">Fraud detection performance</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis domain={[95, 100]} stroke="#64748B" fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

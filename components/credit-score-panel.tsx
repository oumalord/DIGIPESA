"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "./recharts-wrapper"
import { TrendingUp, TrendingDown, CreditCard, Target, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CreditScorePanel() {
  const [creditScore, setCreditScore] = useState(742)
  const [isGenerating, setIsGenerating] = useState(false)

  const scoreHistory = [
    { month: "Jan", score: 698 },
    { month: "Feb", score: 712 },
    { month: "Mar", score: 725 },
    { month: "Apr", score: 718 },
    { month: "May", score: 735 },
    { month: "Jun", score: 742 },
  ]

  const improvements = [
    { factor: "Payment History", impact: "+15", description: "Consistent on-time payments", status: "positive" },
    { factor: "Credit Utilization", impact: "-8", description: "High utilization ratio", status: "negative" },
    { factor: "Credit Age", impact: "+5", description: "Accounts aging well", status: "positive" },
    { factor: "Credit Mix", impact: "+3", description: "Good variety of accounts", status: "positive" },
  ]

  const generateNewScore = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setCreditScore((prev) => prev + Math.floor(Math.random() * 20) - 10)
    setIsGenerating(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600"
    if (score >= 700) return "text-blue-600"
    return "text-yellow-600"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 700) return "Good"
    if (score >= 650) return "Fair"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      {/* Credit Score Display */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">AI Credit Analysis</h3>
                <p className="text-sm text-slate-500">Real-time creditworthiness assessment</p>
              </div>
            </div>
            <Button
              onClick={generateNewScore}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="border-slate-300 bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Analyzing..." : "Refresh"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(creditScore)} mb-2`}>
                {isGenerating ? "..." : creditScore}
              </div>
              <div className="text-xl text-slate-600 mb-4">{getScoreGrade(creditScore)}</div>

              {/* Credit Score Gauge */}
              <div className="relative w-48 h-24 mx-auto mb-6">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M 20 80 A 80 80 0 0 1 180 80" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <path
                    d="M 20 80 A 80 80 0 0 1 180 80"
                    fill="none"
                    stroke="url(#creditGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(creditScore / 850) * 251} 251`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-slate-500">
                  300 - 850 Range
                </div>
              </div>
            </div>

            <div className="h-64 bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Score Trend (6 Months)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis domain={[650, 800]} stroke="#64748B" fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">AI Improvement Recommendations</h3>
              <p className="text-sm text-slate-500">Personalized strategies to enhance credit profile</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {improvements.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{item.factor}</div>
                  <div className="text-sm text-slate-500">{item.description}</div>
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    item.status === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status === "positive" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-bold text-sm">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

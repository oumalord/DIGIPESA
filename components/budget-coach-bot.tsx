"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { calculateExpenseBreakdown, getUserTransactions } from "@/lib/database"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "./recharts-wrapper"
import { MessageCircle, Send, Mic, PieChartIcon, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BudgetCoachBot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: `Hello ${user?.name}! I'm your AI Budget Coach. Based on your income of $${user?.income?.toLocaleString()}, I can help optimize your financial strategy.`,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [expenseData, setExpenseData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    if (user) {
      const transactions = getUserTransactions(user.id)
      const expenses = calculateExpenseBreakdown(user.income, transactions)
      setExpenseData(expenses)

      // Generate monthly data based on income
      const monthlyIncome = user.income / 12
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const monthly = months.map((month) => ({
        month,
        income: monthlyIncome,
        expenses: monthlyIncome * (0.7 + Math.random() * 0.2), // 70-90% of income
        savings: monthlyIncome * (0.1 + Math.random() * 0.2), // 10-30% savings
      }))
      setMonthlyData(monthly)
    }
  }, [user])

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessages = [
      ...messages,
      { type: "user", content: inputMessage },
      { type: "bot", content: getBotResponse(inputMessage) },
    ]
    setMessages(newMessages)
    setInputMessage("")
  }

  const getBotResponse = (message: string) => {
    const income = user?.income || 0
    const monthlyIncome = income / 12

    if (message.toLowerCase().includes("budget") || message.toLowerCase().includes("expense")) {
      return `Based on your annual income of $${income.toLocaleString()}, your monthly budget of $${monthlyIncome.toLocaleString()} should be allocated as shown in the charts. I recommend the 50/30/20 rule adjusted for your income level.`
    }

    if (message.toLowerCase().includes("save")) {
      const recommendedSavings = income > 100000 ? monthlyIncome * 0.25 : monthlyIncome * 0.15
      return `For your income level, I recommend saving $${recommendedSavings.toLocaleString()} per month. This will help you build a strong financial foundation.`
    }

    const responses = [
      `With your income of $${income.toLocaleString()}, you're in a good position to optimize your financial strategy.`,
      `Let me analyze your spending patterns and provide personalized recommendations for your income bracket.`,
      `Based on your financial profile, here are some tailored suggestions to maximize your wealth building.`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Income Overview */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Income Analysis</h3>
              <p className="text-sm text-slate-500">Personalized budget recommendations</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-xl lg:text-2xl font-bold text-blue-600">${user?.income?.toLocaleString()}</div>
              <div className="text-sm text-slate-500">Annual Income</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-xl lg:text-2xl font-bold text-green-600">
                ${Math.round((user?.income || 0) / 12).toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">Monthly Budget</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-xl lg:text-2xl font-bold text-purple-600">
                {user?.income && user.income > 100000 ? "25%" : "15%"}
              </div>
              <div className="text-sm text-slate-500">Savings Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-xl lg:text-2xl font-bold text-orange-600">
                {user?.income && user.income > 100000
                  ? "High"
                  : user?.income && user.income > 50000
                    ? "Medium"
                    : "Entry"}
              </div>
              <div className="text-sm text-slate-500">Income Bracket</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">AI Financial Coach</h3>
              <p className="text-sm text-slate-500">Personalized advice for your income level</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 lg:h-64 overflow-y-auto mb-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-sm p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your budget..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="bg-slate-50 border-slate-200 text-slate-800"
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Recommended Budget</h3>
                <p className="text-sm text-slate-500">Based on your income level</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={30} outerRadius={80} dataKey="value">
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Monthly Trends</h3>
                <p className="text-sm text-slate-500">Income vs expenses</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Bar dataKey="savings" fill="#10B981" />
                  <Bar dataKey="expenses" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

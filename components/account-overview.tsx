"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserTransactions } from "@/lib/database"
import { Wallet, ArrowUpDown, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AccountOverview() {
  const { user } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (user) {
      const userTransactions = getUserTransactions(user.id)
      setTransactions(userTransactions.slice(0, 5)) // Show last 5 transactions
    }
  }, [user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Account Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6" />
              <div>
                <h3 className="text-xl font-semibold">Account Balance</h3>
                <p className="text-blue-100 text-sm">Available funds</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {showBalance ? formatCurrency(user?.accountBalance || 0) : "••••••"}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Credit Score</div>
              <div className="text-xl font-semibold">{user?.creditScore}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="text-sm text-blue-100">Account Status</div>
              <div className="text-xl font-semibold capitalize">{user?.accountStatus}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <ArrowUpDown className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Transfer</h3>
            <p className="text-sm text-slate-500">Send money</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Wallet className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Withdraw</h3>
            <p className="text-sm text-slate-500">Get cash</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Save</h3>
            <p className="text-sm text-slate-500">Build wealth</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <TrendingDown className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Loan</h3>
            <p className="text-sm text-slate-500">Get credit</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
              <p className="text-sm text-slate-500">Your latest activity</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent border-slate-300">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "transfer"
                          ? "bg-blue-100"
                          : transaction.type === "withdrawal"
                            ? "bg-red-100"
                            : transaction.type === "purchase"
                              ? "bg-purple-100"
                              : "bg-green-100"
                      }`}
                    >
                      <ArrowUpDown
                        className={`w-4 h-4 ${
                          transaction.type === "transfer"
                            ? "text-blue-600"
                            : transaction.type === "withdrawal"
                              ? "text-red-600"
                              : transaction.type === "purchase"
                                ? "text-purple-600"
                                : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{transaction.description}</div>
                      <div className="text-sm text-slate-500">{transaction.date.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <ArrowUpDown className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

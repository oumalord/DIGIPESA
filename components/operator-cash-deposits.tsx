"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserByEmail, updateUser, createTransaction, verifyOperatorPin } from "@/lib/database"
import { ArrowDownToLine, Search, DollarSign, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function OperatorCashDeposits() {
  const { user: operator } = useAuth()
  const [depositData, setDepositData] = useState({
    userEmail: "",
    amount: "",
    description: "",
    operatorPin: "",
  })
  const [foundUser, setFoundUser] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [depositComplete, setDepositComplete] = useState(false)
  const [error, setError] = useState("")

  const searchUser = () => {
    setError("")
    if (!depositData.userEmail) {
      setError("Please enter user email")
      return
    }

    const user = getUserByEmail(depositData.userEmail)
    if (user && user.role === "user") {
      setFoundUser(user)
    } else {
      setError("User not found or invalid user type")
      setFoundUser(null)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!foundUser) {
      setError("Please search and select a user first")
      return
    }

    if (!depositData.operatorPin || depositData.operatorPin.length !== 4) {
      setError("Please enter your 4-digit PIN")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Verify operator PIN
      if (!verifyOperatorPin(operator?.id || "", depositData.operatorPin)) {
        setError("Invalid operator PIN. Transaction cancelled.")
        setIsProcessing(false)
        return
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const depositAmount = Number.parseFloat(depositData.amount)

      // Update user balance
      updateUser(foundUser.id, {
        accountBalance: foundUser.accountBalance + depositAmount,
      })

      // Create transaction record
      createTransaction({
        userId: foundUser.id,
        amount: depositAmount,
        type: "deposit",
        category: "Cash Deposit",
        description: depositData.description || `Cash deposit by ${operator?.role} ${operator?.name}`,
        date: new Date(),
        suspicious: false,
        status: "approved",
        operatorId: operator?.id,
      })

      setIsProcessing(false)
      setDepositComplete(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setDepositComplete(false)
        setDepositData({ userEmail: "", amount: "", description: "", operatorPin: "" })
        setFoundUser(null)
      }, 3000)
    } catch (err) {
      setError("Failed to process deposit. Please try again.")
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  if (depositComplete) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <Card className="bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowDownToLine className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Deposit Successful!</h3>
            <p className="text-green-600 mb-4">
              {formatCurrency(Number.parseFloat(depositData.amount))} deposited to {foundUser?.name}'s account
            </p>
            <p className="text-sm text-green-500">Transaction has been recorded and user balance updated</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* User Search */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Find User Account</h3>
              <p className="text-sm text-slate-500">Search for user by email address</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="email"
                value={depositData.userEmail}
                onChange={(e) => setDepositData({ ...depositData, userEmail: e.target.value })}
                placeholder="Enter user email address"
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <Button onClick={searchUser} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {foundUser && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">User Found</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Name:</span> <strong>{foundUser.name}</strong>
                </div>
                <div>
                  <span className="text-green-600">Phone:</span> <strong>{foundUser.phone}</strong>
                </div>
                <div>
                  <span className="text-green-600">Current Balance:</span>{" "}
                  <strong>{formatCurrency(foundUser.accountBalance)}</strong>
                </div>
                <div>
                  <span className="text-green-600">Status:</span>{" "}
                  <strong className="capitalize">{foundUser.accountStatus}</strong>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Form */}
      {foundUser && (
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowDownToLine className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Process Cash Deposit</h3>
                <p className="text-sm text-slate-500">Add funds to {foundUser.name}'s account</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Deposit Amount (KES)
                </label>
                <Input
                  type="number"
                  value={depositData.amount}
                  onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                <Textarea
                  value={depositData.description}
                  onChange={(e) => setDepositData({ ...depositData, description: e.target.value })}
                  placeholder="Cash deposit from customer..."
                  className="bg-slate-50 border-slate-200"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Your {operator?.role === "admin" ? "Administrator" : "Operator"} PIN
                </label>
                <Input
                  type="password"
                  value={depositData.operatorPin}
                  onChange={(e) =>
                    setDepositData({ ...depositData, operatorPin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                  }
                  placeholder="••••"
                  maxLength={4}
                  className="bg-slate-50 border-slate-200 text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Enter your 4-digit PIN to authorize this deposit</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Transaction Summary</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>User:</strong> {foundUser.name} ({foundUser.email})
                  </p>
                  <p>
                    <strong>Current Balance:</strong> {formatCurrency(foundUser.accountBalance)}
                  </p>
                  {depositData.amount && (
                    <p>
                      <strong>New Balance:</strong>{" "}
                      {formatCurrency(foundUser.accountBalance + Number.parseFloat(depositData.amount))}
                    </p>
                  )}
                  <p>
                    <strong>{operator?.role === "admin" ? "Administrator" : "Operator"}:</strong> {operator?.name}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isProcessing ||
                  !depositData.amount ||
                  Number.parseFloat(depositData.amount) <= 0 ||
                  depositData.operatorPin.length !== 4
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {isProcessing
                  ? "Processing Deposit..."
                  : `Deposit ${depositData.amount ? formatCurrency(Number.parseFloat(depositData.amount)) : "Cash"}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

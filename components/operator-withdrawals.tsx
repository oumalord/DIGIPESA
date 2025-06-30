"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserByEmail, updateUser, createTransaction, verifyUserPin, verifyOperatorPin } from "@/lib/database"
import { ArrowUpFromLine, Search, DollarSign, Lock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function OperatorWithdrawals() {
  const { user: operator } = useAuth()
  const [withdrawalData, setWithdrawalData] = useState({
    userEmail: "",
    amount: "",
    userPin: "",
    operatorPin: "",
    description: "",
  })
  const [foundUser, setFoundUser] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [withdrawalComplete, setWithdrawalComplete] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1) // 1: Search User, 2: Enter Amount, 3: PIN Verification

  const searchUser = () => {
    setError("")
    if (!withdrawalData.userEmail) {
      setError("Please enter user email")
      return
    }

    const user = getUserByEmail(withdrawalData.userEmail)
    if (user && user.role === "user") {
      setFoundUser(user)
      setStep(2)
    } else {
      setError("User not found or invalid user type")
      setFoundUser(null)
    }
  }

  const proceedToPin = () => {
    setError("")
    const amount = Number.parseFloat(withdrawalData.amount)

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (amount > foundUser.accountBalance) {
      setError("Insufficient funds in user account")
      return
    }

    setStep(3)
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!foundUser) {
      setError("User not found")
      return
    }

    if (!withdrawalData.userPin || withdrawalData.userPin.length !== 4) {
      setError("Please enter the user's 4-digit PIN")
      return
    }

    if (!withdrawalData.operatorPin || withdrawalData.operatorPin.length !== 4) {
      setError("Please enter your operator PIN")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Verify user PIN first
      if (!verifyUserPin(foundUser.id, withdrawalData.userPin)) {
        setError("Invalid user PIN. Transaction cancelled.")
        setIsProcessing(false)
        return
      }

      // Verify operator PIN
      if (!verifyOperatorPin(operator?.id || "", withdrawalData.operatorPin)) {
        setError("Invalid operator PIN. Transaction cancelled.")
        setIsProcessing(false)
        return
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const withdrawalAmount = Number.parseFloat(withdrawalData.amount)

      // Update user balance
      updateUser(foundUser.id, {
        accountBalance: foundUser.accountBalance - withdrawalAmount,
      })

      // Create transaction record
      createTransaction({
        userId: foundUser.id,
        amount: -withdrawalAmount,
        type: "withdrawal",
        category: "Cash Withdrawal",
        description: withdrawalData.description || `Cash withdrawal processed by ${operator?.role} ${operator?.name}`,
        date: new Date(),
        suspicious: false,
        status: "approved",
        operatorId: operator?.id,
      })

      setIsProcessing(false)
      setWithdrawalComplete(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setWithdrawalComplete(false)
        setWithdrawalData({ userEmail: "", amount: "", userPin: "", operatorPin: "", description: "" })
        setFoundUser(null)
        setStep(1)
      }, 3000)
    } catch (err) {
      setError("Failed to process withdrawal. Please try again.")
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  const resetProcess = () => {
    setWithdrawalData({ userEmail: "", amount: "", userPin: "", operatorPin: "", description: "" })
    setFoundUser(null)
    setStep(1)
    setError("")
  }

  if (withdrawalComplete) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <Card className="bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowUpFromLine className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Withdrawal Successful!</h3>
            <p className="text-green-600 mb-4">
              {formatCurrency(Number.parseFloat(withdrawalData.amount))} withdrawn from {foundUser?.name}'s account
            </p>
            <p className="text-sm text-green-500">Please provide cash to the customer</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Progress Indicator */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-100" : "bg-slate-100"}`}
              >
                1
              </div>
              <span className="text-sm font-medium">Find User</span>
            </div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-100" : "bg-slate-100"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">Enter Amount</span>
            </div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? "text-blue-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-100" : "bg-slate-100"}`}
              >
                3
              </div>
              <span className="text-sm font-medium">PIN Verification</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: User Search */}
      {step === 1 && (
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
                  value={withdrawalData.userEmail}
                  onChange={(e) => setWithdrawalData({ ...withdrawalData, userEmail: e.target.value })}
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
          </CardContent>
        </Card>
      )}

      {/* Step 2: Enter Amount */}
      {step === 2 && foundUser && (
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Enter Withdrawal Amount</h3>
                  <p className="text-sm text-slate-500">Specify amount to withdraw</p>
                </div>
              </div>
              <Button onClick={resetProcess} variant="outline" size="sm" className="bg-transparent">
                Start Over
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">User Account</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <strong>Name:</strong> {foundUser.name}
                </div>
                <div>
                  <strong>Phone:</strong> {foundUser.phone}
                </div>
                <div>
                  <strong>Available Balance:</strong> {formatCurrency(foundUser.accountBalance)}
                </div>
                <div>
                  <strong>Status:</strong> <span className="capitalize">{foundUser.accountStatus}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Amount (KES)</label>
                <Input
                  type="number"
                  value={withdrawalData.amount}
                  onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
                  placeholder="0.00"
                  min="1"
                  max={foundUser.accountBalance}
                  step="0.01"
                  className="bg-slate-50 border-slate-200"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Maximum: {formatCurrency(foundUser.accountBalance)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                <Textarea
                  value={withdrawalData.description}
                  onChange={(e) => setWithdrawalData({ ...withdrawalData, description: e.target.value })}
                  placeholder="Cash withdrawal..."
                  className="bg-slate-50 border-slate-200"
                  rows={3}
                />
              </div>

              <Button
                onClick={proceedToPin}
                disabled={!withdrawalData.amount || Number.parseFloat(withdrawalData.amount) <= 0}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Proceed to PIN Verification
              </Button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: PIN Verification */}
      {step === 3 && foundUser && (
        <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Dual PIN Verification Required</h3>
                  <p className="text-sm text-slate-500">Both customer and {operator?.role} PIN required</p>
                </div>
              </div>
              <Button onClick={() => setStep(2)} variant="outline" size="sm" className="bg-transparent">
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Security Verification</h4>
              <p className="text-sm text-yellow-700">
                Both the customer's PIN and your {operator?.role} PIN are required to authorize this withdrawal.
              </p>
            </div>

            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 mb-2">Transaction Summary</h4>
              <div className="text-sm text-slate-700 space-y-1">
                <p>
                  <strong>Customer:</strong> {foundUser.name}
                </p>
                <p>
                  <strong>Withdrawal Amount:</strong> {formatCurrency(Number.parseFloat(withdrawalData.amount))}
                </p>
                <p>
                  <strong>Current Balance:</strong> {formatCurrency(foundUser.accountBalance)}
                </p>
                <p>
                  <strong>Balance After:</strong>{" "}
                  {formatCurrency(foundUser.accountBalance - Number.parseFloat(withdrawalData.amount))}
                </p>
              </div>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Customer's 4-Digit PIN
                </label>
                <Input
                  type="password"
                  value={withdrawalData.userPin}
                  onChange={(e) =>
                    setWithdrawalData({ ...withdrawalData, userPin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                  }
                  placeholder="••••"
                  maxLength={4}
                  className="bg-slate-50 border-slate-200 text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Customer must enter their PIN</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Your {operator?.role === "admin" ? "Administrator" : "Operator"} PIN
                </label>
                <Input
                  type="password"
                  value={withdrawalData.operatorPin}
                  onChange={(e) =>
                    setWithdrawalData({ ...withdrawalData, operatorPin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                  }
                  placeholder="••••"
                  maxLength={4}
                  className="bg-slate-50 border-slate-200 text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Enter your {operator?.role} PIN to authorize</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isProcessing || withdrawalData.userPin.length !== 4 || withdrawalData.operatorPin.length !== 4
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isProcessing ? "Processing Withdrawal..." : "Authorize Withdrawal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

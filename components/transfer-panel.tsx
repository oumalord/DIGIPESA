"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createTransaction, verifyUserPin, getAllUsers } from "@/lib/database"
import { ArrowUpDown, Send, User, DollarSign, Lock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TransferPanel() {
  const { user } = useAuth()
  const [transferData, setTransferData] = useState({
    recipient: "",
    recipientType: "external", // "self" or "external"
    amount: "",
    description: "",
    pin: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [transferComplete, setTransferComplete] = useState(false)
  const [error, setError] = useState("")

  const allUsers = getAllUsers()
  const otherUsers = allUsers.filter((u) => u.id !== user?.id && u.role === "user")

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user || !transferData.amount || !transferData.pin) {
      setError("Please fill in all required fields")
      return
    }

    if (transferData.recipientType === "external" && !transferData.recipient) {
      setError("Please select or enter a recipient")
      return
    }

    if (transferData.pin.length !== 4) {
      setError("PIN must be exactly 4 digits")
      return
    }

    const amount = Number.parseFloat(transferData.amount)
    if (amount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    if (amount > user.accountBalance) {
      setError("Insufficient funds")
      return
    }

    setIsProcessing(true)

    try {
      // Verify PIN
      if (!verifyUserPin(user.id, transferData.pin)) {
        setError("Invalid PIN. Transaction cancelled.")
        setIsProcessing(false)
        return
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let recipientName = ""
      let transactionDescription = ""

      if (transferData.recipientType === "self") {
        recipientName = "Yourself (Internal Transfer)"
        transactionDescription = `Internal transfer - ${transferData.description || "Self transfer"}`

        // For self transfers, we create both debit and credit transactions
        createTransaction({
          userId: user.id,
          amount: -amount,
          type: "transfer",
          category: "Internal Transfer",
          description: `Transfer to self - ${transferData.description || "Internal transfer"}`,
          date: new Date(),
          suspicious: false,
          status: "approved",
        })

        createTransaction({
          userId: user.id,
          amount: amount,
          type: "deposit",
          category: "Internal Transfer",
          description: `Transfer from self - ${transferData.description || "Internal transfer"}`,
          date: new Date(),
          suspicious: false,
          status: "approved",
        })
      } else {
        recipientName = transferData.recipient
        transactionDescription = `Transfer to ${transferData.recipient}`

        // Create transaction record for external transfer
        createTransaction({
          userId: user.id,
          amount: -amount,
          type: "transfer",
          category: "Transfer",
          description: transactionDescription,
          date: new Date(),
          suspicious: false,
          status: "approved",
        })

        // Update user balance (in real app, this would be handled by the transaction processing)
        user.accountBalance -= amount
      }

      setIsProcessing(false)
      setTransferComplete(true)

      // Store recipient name for success message
      setTransferData((prev) => ({ ...prev, recipient: recipientName }))

      // Reset form after 3 seconds
      setTimeout(() => {
        setTransferComplete(false)
        setTransferData({
          recipient: "",
          recipientType: "external",
          amount: "",
          description: "",
          pin: "",
        })
      }, 3000)
    } catch (error) {
      setError("Transaction failed. Please try again.")
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  if (transferComplete) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <Card className="bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {transferData.recipientType === "self" ? (
                <RefreshCw className="w-8 h-8 text-green-600" />
              ) : (
                <Send className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              {transferData.recipientType === "self" ? "Internal Transfer Successful!" : "Transfer Successful!"}
            </h3>
            <p className="text-green-600 mb-4">
              {formatCurrency(Number.parseFloat(transferData.amount))}
              {transferData.recipientType === "self" ? " transferred internally" : ` sent to ${transferData.recipient}`}
            </p>
            <p className="text-sm text-green-500">Transaction will appear in your statement shortly</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Transfer Form */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Transfer Money</h3>
              <p className="text-sm text-slate-500">Send money to another account or yourself</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Transfer Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Transfer Type</label>
              <Select
                value={transferData.recipientType}
                onValueChange={(value) =>
                  setTransferData({
                    ...transferData,
                    recipientType: value,
                    recipient: value === "self" ? "Yourself" : "",
                  })
                }
              >
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select transfer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Transfer to Yourself (Internal)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="external">
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Transfer to Another Account</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Selection - Only show for external transfers */}
            {transferData.recipientType === "external" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Recipient
                </label>
                <Select
                  value={transferData.recipient}
                  onValueChange={(value) => setTransferData({ ...transferData, recipient: value })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select recipient or enter manually" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherUsers.map((otherUser) => (
                      <SelectItem key={otherUser.id} value={otherUser.name}>
                        <div className="flex flex-col">
                          <span>{otherUser.name}</span>
                          <span className="text-xs text-gray-500">{otherUser.phone}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Input
                    value={transferData.recipient}
                    onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                    placeholder="Or enter account number/phone number manually"
                    className="bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Self Transfer Info */}
            {transferData.recipientType === "self" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Internal Transfer</h4>
                    <p className="text-sm text-blue-600">
                      This will create an internal transaction record for your account. Useful for organizing your
                      finances or moving money between categories.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Amount (KES)
              </label>
              <Input
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                placeholder="0.00"
                min="1"
                max={user?.accountBalance}
                className="bg-slate-50 border-slate-200"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Available balance: {formatCurrency(user?.accountBalance || 0)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description {transferData.recipientType === "self" ? "(Optional)" : "(Optional)"}
              </label>
              <Textarea
                value={transferData.description}
                onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                placeholder={
                  transferData.recipientType === "self"
                    ? "What's this internal transfer for? (e.g., Savings, Emergency fund)"
                    : "What's this transfer for?"
                }
                className="bg-slate-50 border-slate-200"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Your 4-Digit PIN
              </label>
              <Input
                type="password"
                value={transferData.pin}
                onChange={(e) =>
                  setTransferData({ ...transferData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                placeholder="••••"
                maxLength={4}
                className="bg-slate-50 border-slate-200 text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Enter your 4-digit PIN to authorize this transfer</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={
                isProcessing ||
                !transferData.amount ||
                transferData.pin.length !== 4 ||
                (transferData.recipientType === "external" && !transferData.recipient)
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isProcessing
                ? "Processing Transfer..."
                : transferData.recipientType === "self"
                  ? `Internal Transfer ${transferData.amount ? formatCurrency(Number.parseFloat(transferData.amount)) : "Money"}`
                  : `Transfer ${transferData.amount ? formatCurrency(Number.parseFloat(transferData.amount)) : "Money"}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Transfer Limits */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Transfer Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">KES 100,000</div>
              <div className="text-sm text-slate-500">Daily Limit</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">KES 500,000</div>
              <div className="text-sm text-slate-500">Monthly Limit</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">Instant</div>
              <div className="text-sm text-slate-500">Transfer Speed</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">Internal Transfers</h4>
            <p className="text-sm text-yellow-700">
              Self-transfers have no limits and are processed instantly. Perfect for organizing your finances!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

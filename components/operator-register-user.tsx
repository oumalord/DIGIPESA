"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createUser, getUserByEmail } from "@/lib/database"
import { UserPlus, Mail, Phone, Lock, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function OperatorRegisterUser() {
  const { user: operator } = useAuth()
  const [userData, setUserData] = useState({
    email: "",
    pin: "",
    password: "",
    phone: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    setError("")

    // Validate PIN is 4 digits
    if (userData.pin.length !== 4 || !/^\d{4}$/.test(userData.pin)) {
      setError("PIN must be exactly 4 digits")
      setIsRegistering(false)
      return
    }

    // Check if email already exists
    if (getUserByEmail(userData.email)) {
      setError("Email already exists in the system")
      setIsRegistering(false)
      return
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Extract name from email (before @)
      const name = userData.email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())

      // Create new user
      const newUser = createUser({
        email: userData.email,
        password: userData.password,
        pin: userData.pin,
        phone: userData.phone,
        role: "user",
        name: name,
        nationalId: `ID${Date.now()}`, // Generate temporary ID
        income: 50000, // Default income
        creditScore: 650, // Default credit score
        accountBalance: 0, // Start with zero balance
        clearanceLevel: 3,
        registrationFee: 500,
        accountStatus: "active",
      })

      setIsRegistering(false)
      setRegistrationComplete(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setRegistrationComplete(false)
        setUserData({
          email: "",
          pin: "",
          password: "",
          phone: "",
        })
      }, 5000)
    } catch (err) {
      setError("Failed to register user. Please try again.")
      setIsRegistering(false)
    }
  }

  if (registrationComplete) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <Card className="bg-green-50 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">User Registered Successfully!</h3>
            <p className="text-green-600 mb-4">New user account has been created</p>
            <div className="bg-white/70 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-700">
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {userData.phone}
                </p>
                <p>
                  <strong>Registration Fee:</strong> KES 500 (to be collected)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Registration Form */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Register New User</h3>
              <p className="text-sm text-slate-500">Create a new user account in the system</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  User Email Address
                </label>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <Input
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder="+254712345678"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  4-Digit PIN
                </label>
                <Input
                  type="password"
                  value={userData.pin}
                  onChange={(e) => setUserData({ ...userData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  placeholder="1234"
                  maxLength={4}
                  className="bg-slate-50 border-slate-200"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Used for transaction verification</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Account Password
                </label>
                <Input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Create secure password"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Registration Details</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Registration fee: <strong>KES 500</strong> (to be collected from user)
                </li>
                <li>
                  • Default credit score: <strong>650</strong>
                </li>
                <li>
                  • Security clearance: <strong>Level 3</strong>
                </li>
                <li>
                  • Account starts with <strong>KES 0</strong> balance
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={
                isRegistering ||
                !userData.email ||
                !userData.pin ||
                !userData.password ||
                !userData.phone ||
                userData.pin.length !== 4
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isRegistering ? "Registering User..." : "Register User Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Operator Info */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Operator Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{operator?.name}</div>
              <div className="text-sm text-slate-500">Operator Name</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">Level {operator?.clearanceLevel}</div>
              <div className="text-sm text-slate-500">Security Clearance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">Active</div>
              <div className="text-sm text-slate-500">Operator Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

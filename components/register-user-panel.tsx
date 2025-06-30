"use client"

import type React from "react"

import { useState } from "react"
import { createUser } from "@/lib/database"
import { UserPlus, Mail, Phone, CreditCard, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterUserPanel() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nationalId: "",
    income: "",
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new user
    const newUser = createUser({
      ...userData,
      password: userData.password,
      role: "user",
      income: Number.parseFloat(userData.income),
      creditScore: 650, // Default credit score
      accountBalance: 0,
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
        name: "",
        email: "",
        password: "",
        phone: "",
        nationalId: "",
        income: "",
      })
    }, 5000)
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
            <p className="text-green-600 mb-4">{userData.name} has been added to the system</p>
            <p className="text-sm text-green-500">Registration fee of KES 500 has been collected</p>
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
              <p className="text-sm text-slate-500">Add a new user to the system</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <Input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Create password"
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
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  National ID
                </label>
                <Input
                  value={userData.nationalId}
                  onChange={(e) => setUserData({ ...userData, nationalId: e.target.value })}
                  placeholder="Enter national ID number"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Annual Income (KES)
                </label>
                <Input
                  type="number"
                  value={userData.income}
                  onChange={(e) => setUserData({ ...userData, income: e.target.value })}
                  placeholder="Enter annual income"
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Registration Fee</h4>
              <p className="text-sm text-yellow-700">
                A registration fee of <strong>KES 500</strong> will be collected from the user upon account creation.
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                isRegistering ||
                !userData.name ||
                !userData.email ||
                !userData.password ||
                !userData.phone ||
                !userData.nationalId ||
                !userData.income
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isRegistering ? "Registering User..." : "Register User (KES 500 Fee)"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Registration Info */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Registration Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">KES 500</div>
              <div className="text-sm text-slate-500">Registration Fee</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">Level 3</div>
              <div className="text-sm text-slate-500">Default Clearance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">650</div>
              <div className="text-sm text-slate-500">Starting Credit Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

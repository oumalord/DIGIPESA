"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = login(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
    setIsLoading(false)
  }

  const demoCredentials = [
    { role: "User", email: "brianmageto@digipesa.com", password: "Brian@2001", clearance: "Level 3" },
    { role: "Admin", email: "obwandalordphick@digipesa.com", password: "JESUS39814057", clearance: "Level 5" },
    { role: "Operator", email: "harietbeverlyne@digipesa.com", password: "Hariet@345", clearance: "Level 4" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <Image src="/images/digipesa-logo.jpg" alt="DIGIPESA Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">DIGIPESA</h1>
                <p className="text-slate-600">Digital Financial Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Advanced Digital Financial Security & Management Platform
              </h2>
              <p className="text-lg text-slate-600">
                Where Technology Meets Your Wallet - Military-grade security with AI-powered financial management,
                real-time fraud detection, and comprehensive digital banking solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">99.7%</div>
                <div className="text-sm text-slate-600">Detection Accuracy</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-slate-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src="/images/digipesa-logo.jpg" alt="DIGIPESA Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">DIGIPESA</h1>
            <p className="text-slate-600">Digital Financial Platform</p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800">Secure Access</CardTitle>
              <p className="text-slate-600">Enter your security clearance credentials</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access System"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="bg-white/60 backdrop-blur-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoCredentials.map((cred, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="mb-2 sm:mb-0">
                      <div className="font-medium text-slate-800">{cred.role}</div>
                      <div className="text-sm text-slate-600">{cred.clearance}</div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="text-slate-600">
                        Email: <span className="font-mono">{cred.email}</span>
                      </div>
                      <div className="text-slate-600">
                        Password: <span className="font-mono">{cred.password}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

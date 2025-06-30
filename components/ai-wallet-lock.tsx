"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Shield, Lock, Unlock, AlertTriangle, Eye, Fingerprint, Smartphone, Wifi, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ThreatEvent {
  id: string
  type: "login_attempt" | "transaction_anomaly" | "location_change" | "device_change"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  location?: string
}

interface BiometricStatus {
  fingerprint: boolean
  faceId: boolean
  voiceId: boolean
}

export function AIWalletLock() {
  const { user } = useAuth()
  const [isLocked, setIsLocked] = useState(false)
  const [securityScore, setSecurityScore] = useState(87)
  const [threatLevel, setThreatLevel] = useState<"low" | "medium" | "high" | "critical">("low")
  const [biometrics, setBiometrics] = useState<BiometricStatus>({
    fingerprint: true,
    faceId: false,
    voiceId: true,
  })
  const [recentThreats, setRecentThreats] = useState<ThreatEvent[]>([
    {
      id: "1",
      type: "login_attempt",
      severity: "medium",
      message: "Unusual login location detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      location: "Nairobi, Kenya",
    },
    {
      id: "2",
      type: "transaction_anomaly",
      severity: "low",
      message: "Transaction pattern analysis complete",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
  ])

  useEffect(() => {
    // Simulate real-time threat monitoring
    const interval = setInterval(() => {
      const randomThreat = Math.random()
      if (randomThreat > 0.95) {
        const newThreat: ThreatEvent = {
          id: Date.now().toString(),
          type: ["login_attempt", "transaction_anomaly", "location_change", "device_change"][
            Math.floor(Math.random() * 4)
          ] as any,
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          message: [
            "New device detected",
            "Unusual spending pattern",
            "Multiple login attempts",
            "Location verification required",
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
        }

        setRecentThreats((prev) => [newThreat, ...prev.slice(0, 4)])

        // Update threat level based on recent events
        const highSeverityCount = recentThreats.filter((t) => t.severity === "high" || t.severity === "critical").length
        if (highSeverityCount >= 2) {
          setThreatLevel("high")
          setSecurityScore((prev) => Math.max(prev - 5, 60))
        } else if (highSeverityCount >= 1) {
          setThreatLevel("medium")
          setSecurityScore((prev) => Math.max(prev - 2, 70))
        } else {
          setThreatLevel("low")
          setSecurityScore((prev) => Math.min(prev + 1, 95))
        }
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [recentThreats])

  const toggleLock = () => {
    setIsLocked(!isLocked)
    if (!isLocked) {
      // Auto-unlock after 30 seconds for demo
      setTimeout(() => setIsLocked(false), 30000)
    }
  }

  const toggleBiometric = (type: keyof BiometricStatus) => {
    setBiometrics((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))

    // Update security score based on biometric settings
    const enabledCount = Object.values({ ...biometrics, [type]: !biometrics[type] }).filter(Boolean).length
    setSecurityScore((prev) => Math.min(60 + enabledCount * 10, 95))
  }

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-700 bg-red-100"
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* Security Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  securityScore >= 80 ? "bg-green-100" : securityScore >= 60 ? "bg-yellow-100" : "bg-red-100"
                }`}
              >
                <Shield className={`w-5 h-5 ${getScoreColor(securityScore)}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Security Score</h3>
                <p className="text-sm text-slate-600">Real-time protection status</p>
              </div>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}%</div>
          </div>
          <Progress value={securityScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Wallet Lock Control */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isLocked ? "bg-red-100" : "bg-green-100"}`}>
                {isLocked ? <Lock className="w-5 h-5 text-red-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Wallet Status</h3>
                <p className="text-sm text-slate-600">
                  {isLocked ? "Wallet is locked and secure" : "Wallet is active and accessible"}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleLock}
              className={`${isLocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white`}
            >
              {isLocked ? "Unlock" : "Lock"}
            </Button>
          </div>

          {isLocked && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">
                  All transactions are blocked. Biometric authentication required to unlock.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biometric Controls */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Biometric Authentication</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-700">Fingerprint</span>
              </div>
              <Button
                size="sm"
                onClick={() => toggleBiometric("fingerprint")}
                className={`${
                  biometrics.fingerprint ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                } text-white`}
              >
                {biometrics.fingerprint ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-slate-700">Face ID</span>
              </div>
              <Button
                size="sm"
                onClick={() => toggleBiometric("faceId")}
                className={`${
                  biometrics.faceId ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                } text-white`}
              >
                {biometrics.faceId ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-700">Voice ID</span>
              </div>
              <Button
                size="sm"
                onClick={() => toggleBiometric("voiceId")}
                className={`${
                  biometrics.voiceId ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                } text-white`}
              >
                {biometrics.voiceId ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Monitoring */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Security Events</h3>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                threatLevel === "high"
                  ? "bg-red-100 text-red-700"
                  : threatLevel === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {threatLevel.toUpperCase()} RISK
            </div>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentThreats.map((threat) => (
              <div key={threat.id} className="flex items-start space-x-3 p-2 bg-slate-50 rounded-lg">
                <Activity className="w-4 h-4 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-800">{threat.message}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getThreatColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {threat.timestamp.toLocaleTimeString()} {threat.location && `• ${threat.location}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-green-600" />
              <div>
                <span className="text-sm font-medium text-slate-800">Secure Connection</span>
                <p className="text-xs text-slate-500">256-bit encryption active</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

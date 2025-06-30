"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Mic, MicOff, MessageSquare, Brain, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnhancedVoiceAssistant() {
  const { user } = useAuth()
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false)
      return
    }

    setIsListening(true)
    setIsProcessing(true)

    // Simulate voice recognition
    setTimeout(() => {
      const commands = [
        "Show last month expenses",
        "Check for fraud alerts",
        "What is my credit score",
        "Generate budget report",
        "Lock my wallet",
        "Show security status",
        user?.role === "admin" ? "System overview" : "Account balance",
        user?.role === "operator" ? "Pending deposits" : "Recent transactions",
      ]

      const command = commands[Math.floor(Math.random() * commands.length)]
      if (command) {
        setLastCommand(command)
        setResponse(getEnhancedVoiceResponse(command))
      }
      setIsListening(false)
      setIsProcessing(false)
    }, 3000)
  }

  const getEnhancedVoiceResponse = (command: string) => {
    const responses: Record<string, string> = {
      "Show last month expenses": `Your total expenses last month were ${new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(3200)}. Housing was your largest expense.`,
      "Check for fraud alerts":
        "AI fraud detection active. I found 2 suspicious transactions flagged for review. Account #4521 shows high-risk activity.",
      "What is my credit score": `Your current credit score is ${user?.creditScore}, which is considered ${user?.creditScore && user.creditScore >= 750 ? "excellent" : "good"}. It increased by 15 points this month.`,
      "Generate budget report":
        "Your AI budget analysis shows you're saving 25% of your income. Excellent financial discipline detected.",
      "Lock my wallet": "AI wallet lock activated. Enhanced security protocols engaged. Your wallet is now secured.",
      "Show security status": `Security clearance level ${user?.clearanceLevel}. All biometric systems operational. No threats detected.`,
      "System overview":
        "System operating at 99.9% uptime. 1,247 users monitored. 23 transactions flagged for review. All security systems operational.",
      "Pending deposits": "You have 3 pending deposit requests totaling KES 15,000 requiring approval.",
      "Account balance": `Your current balance is ${new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(user?.accountBalance || 0)}. Account status: ${user?.accountStatus}.`,
      "Recent transactions": "Your last transaction was a transfer of KES 1,200. All recent activity appears normal.",
    }

    return (
      responses[command] ||
      "I'm processing your request with advanced AI algorithms. Please wait a moment for analysis."
    )
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Enhanced AI Assistant</h3>
            <p className="text-sm text-slate-500">Advanced voice-powered financial AI</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6">
          <Button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : isProcessing
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            } shadow-lg transition-all duration-300`}
          >
            {isProcessing ? (
              <Zap className="w-8 h-8 text-white animate-spin" />
            ) : isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {isListening && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="ml-2 text-sm font-medium">AI Listening...</span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <Brain className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Neural Processing...</span>
            </div>
          )}

          {lastCommand && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-1 flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                You said:
              </div>
              <div className="text-indigo-600 font-medium">"{lastCommand}"</div>
            </div>
          )}

          {response && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-200">
              <div className="text-xs text-slate-500 mb-1 flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                AI Assistant:
              </div>
              <div className="text-slate-700">{response}</div>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-indigo-50 p-3 rounded-lg border border-slate-200">
          <div className="font-medium mb-1">Enhanced Voice Commands:</div>
          <div className="grid grid-cols-1 gap-1">
            <div>"Lock my wallet" • "Security status" • "Fraud check"</div>
            {user?.role === "admin" && <div>"System overview" • "User analytics"</div>}
            {user?.role === "operator" && <div>"Pending deposits" • "User registrations"</div>}
            {user?.role === "user" && <div>"Show balance" • "Budget analysis"</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

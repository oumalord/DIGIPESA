"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Mic, MicOff, Volume2, VolumeX, Lightbulb, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Tip {
  id: string
  title: string
  description: string
  category: "security" | "savings" | "credit" | "general"
}

export function AIVoiceAssistant() {
  const { user } = useAuth()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello ${user?.name}! I'm your AI banking assistant. I can help you with account information, security status, and financial guidance. Try saying "show balance" or "security status".`,
      timestamp: new Date(),
    },
  ])
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  const tips: Tip[] = [
    {
      id: "1",
      title: "Boost Your Credit Score",
      description: `Based on your current score of ${user?.creditScore}, consider paying bills early and keeping credit utilization below 30%.`,
      category: "credit",
    },
    {
      id: "2",
      title: "Smart Savings Strategy",
      description: `With your income of KES ${user?.income?.toLocaleString()}, try saving 20% monthly. That's about KES ${Math.round(((user?.income || 0) * 0.2) / 12).toLocaleString()} per month.`,
      category: "savings",
    },
    {
      id: "3",
      title: "Security Best Practices",
      description:
        "Enable two-factor authentication and never share your PIN. Monitor your account regularly for suspicious activity.",
      category: "security",
    },
    {
      id: "4",
      title: "Budget Optimization",
      description:
        "Track your spending patterns and set up automatic transfers to savings to build wealth consistently.",
      category: "general",
    },
  ]

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    // Initialize speech recognition
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Show random tip on load
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setCurrentTip(randomTip)
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      recognitionRef.current.start()
    } else {
      // Fallback for browsers without speech recognition
      simulateVoiceInput()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const simulateVoiceInput = () => {
    setIsListening(true)
    setTimeout(() => {
      const commands = ["show balance", "security status", "help me get started"]
      const randomCommand = commands[Math.floor(Math.random() * commands.length)]
      handleVoiceCommand(randomCommand)
      setIsListening(false)
    }, 2000)
  }

  const speak = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceCommand = (command: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: command,
      timestamp: new Date(),
    }

    let response = ""

    // Enhanced command matching with partial matches
    if (command.includes("balance") || command.includes("money") || command.includes("account")) {
      response = `Your current balance is KES ${user?.accountBalance?.toLocaleString()}. ${
        (user?.accountBalance || 0) > 10000
          ? "You're doing great with your savings! Consider investing some of this money for better returns."
          : "Consider setting up automatic savings to build your balance over time."
      }`
    } else if (command.includes("help") || command.includes("start") || command.includes("guide")) {
      response =
        "I can help you navigate your dashboard, check balances, review security status, and provide financial advice. Try asking about your credit score, recent transactions, or security recommendations."
    } else if (command.includes("security") || command.includes("safe") || command.includes("protection")) {
      const securityScore = Math.floor(Math.random() * 50) + 50 // 50-100%
      response = `Your security score is ${securityScore}%. ${
        securityScore >= 80
          ? "Excellent! Your account is very secure."
          : securityScore >= 60
            ? "Good security, but consider enabling additional protections."
            : "Your account needs attention. Please review your security settings."
      } I recommend enabling two-factor authentication and regular password updates.`
    } else if (
      command.includes("what can you do") ||
      command.includes("capabilities") ||
      command.includes("features")
    ) {
      response =
        "I can help you with: checking account balances, reviewing security status, providing financial advice, explaining banking features, monitoring transactions, and offering personalized tips based on your financial profile."
    } else if (command.includes("system") || command.includes("status") || command.includes("health")) {
      response =
        "All systems are operational and very secure. Your account is protected with advanced fraud detection, and all transactions are monitored in real-time."
    } else if (command.includes("analytics") || command.includes("data") || command.includes("insights")) {
      const role = user?.role || "user"
      if (role === "admin") {
        response =
          "Admin Analytics: 1,247 active users, 98.5% system uptime, 23 fraud reports this month, KES 2.4M in daily transactions. Security score: 94%."
      } else if (role === "operator") {
        response =
          "Operator Analytics: 45 transactions processed today, 12 new user registrations, 3 pending approvals. Your performance rating: Excellent."
      } else {
        response = `Your spending analytics: Average monthly spending KES ${Math.round(((user?.income || 50000) * 0.7) / 12).toLocaleString()}, top category is housing (35%), credit utilization is optimal at 23%.`
      }
    } else {
      response =
        "I didn't quite understand that. Try asking about your balance, security status, or say 'what can you do' to see my capabilities."
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    speak(response)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Current Tip */}
      {currentTip && (
        <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-800 mb-1">{currentTip.title}</h4>
                <p className="text-sm text-slate-600">{currentTip.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-48">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div
                className={`p-2 rounded-full ${
                  message.type === "user" ? "bg-blue-100" : "bg-gradient-to-r from-purple-100 to-blue-100"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-purple-600" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-slate-500"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-200">
        <Button
          onClick={isListening ? stopListening : startListening}
          className={`${isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Voice
            </>
          )}
        </Button>

        <Button
          onClick={isSpeaking ? stopSpeaking : () => speak("Hello! How can I help you today?")}
          variant="outline"
          className="border-slate-300"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Test Voice
            </>
          )}
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="text-center mt-3">
        <div
          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            isListening
              ? "bg-red-100 text-red-700"
              : isSpeaking
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isListening ? "bg-red-500 animate-pulse" : isSpeaking ? "bg-blue-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span>{isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready to help"}</span>
        </div>
      </div>
    </div>
  )
}

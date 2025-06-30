"use client"

import { useState } from "react"
import { Bot, Shield, Mic, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIVoiceAssistant } from "./ai-voice-assistant"
import { AIWalletLock } from "./ai-wallet-lock"

export function AIPullUpMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("assistant")

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}

      {/* Pull-up Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-4rem)]"
        }`}
      >
        <Card className="rounded-t-2xl border-t border-x border-slate-200/50 bg-white/95 backdrop-blur-sm shadow-2xl">
          {/* Handle Bar */}
          <div className="flex justify-center py-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">AI Assistant</h3>
                  <p className="text-sm text-slate-500">Your intelligent banking companion</p>
                </div>
              </div>

              {!isOpen && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(true)
                      setActiveTab("assistant")
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Mic className="w-4 h-4 mr-1" />
                    Voice
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(true)
                      setActiveTab("security")
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Security
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {isOpen && (
            <CardContent className="px-6 pb-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("assistant")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "assistant"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Assistant</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>AI Security</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="h-96 overflow-hidden">
                {activeTab === "assistant" && <AIVoiceAssistant />}
                {activeTab === "security" && <AIWalletLock />}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

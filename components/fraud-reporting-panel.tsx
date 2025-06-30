"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { createFraudReport } from "@/lib/database"
import { AlertTriangle, FileText, Clock, CheckCircle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function FraudReportingPanel() {
  const { user } = useAuth()
  const [reportForm, setReportForm] = useState({
    accountId: "",
    transactionId: "",
    description: "",
    amount: "",
    riskLevel: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const submitReport = async () => {
    if (!user || !reportForm.accountId || !reportForm.description || !reportForm.amount) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Create fraud report in database
      const reportData = {
        reportedBy: user.id,
        reporterRole: user.role as "user" | "operator" | "admin",
        accountId: reportForm.accountId.startsWith("#") ? reportForm.accountId : `#${reportForm.accountId}`,
        transactionId: reportForm.transactionId || undefined,
        amount: Number.parseFloat(reportForm.amount),
        description: reportForm.description,
        riskLevel: reportForm.riskLevel,
        status: "pending" as const,
      }

      createFraudReport(reportData)

      // Reset form
      setReportForm({
        accountId: "",
        transactionId: "",
        description: "",
        amount: "",
        riskLevel: "MEDIUM",
      })

      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      alert("Failed to submit fraud report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-600 bg-green-100"
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100"
      case "HIGH":
        return "text-red-600 bg-red-100"
      case "CRITICAL":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {submitSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Fraud Report Submitted Successfully</div>
                <div className="text-sm text-green-600">
                  Your report has been sent to administrators for review. You will be notified of any updates.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Form */}
      <Card className="bg-white/70 backdrop-blur-sm border border-red-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Report Suspicious Activity</h3>
              <p className="text-sm text-slate-500">Help us keep the system secure by reporting fraud</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account ID <span className="text-red-500">*</span>
              </label>
              <Input
                value={reportForm.accountId}
                onChange={(e) => setReportForm({ ...reportForm, accountId: e.target.value })}
                placeholder="#1234 or account number"
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Transaction ID</label>
              <Input
                value={reportForm.transactionId}
                onChange={(e) => setReportForm({ ...reportForm, transactionId: e.target.value })}
                placeholder="TXN123456 (optional)"
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount (KES) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={reportForm.amount}
                onChange={(e) => setReportForm({ ...reportForm, amount: e.target.value })}
                placeholder="0.00"
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
              <select
                value={reportForm.riskLevel}
                onChange={(e) => setReportForm({ ...reportForm, riskLevel: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              placeholder="Describe the suspicious activity in detail..."
              className="bg-slate-50 border-slate-200 h-24"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">Risk Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(reportForm.riskLevel)}`}>
                {reportForm.riskLevel}
              </span>
            </div>

            <Button onClick={submitReport} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Fraud Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-800 mb-2">Important Information</div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All fraud reports are reviewed by system administrators</li>
                <li>• Reports are processed within 24 hours during business days</li>
                <li>• Provide as much detail as possible for faster resolution</li>
                <li>• False reports may result in account restrictions</li>
                <li>• You will be notified of any actions taken on your report</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

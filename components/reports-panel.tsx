"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { FileText, Download, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ReportsPanel() {
  const { user } = useAuth()
  const [selectedReport, setSelectedReport] = useState("")
  const [dateRange, setDateRange] = useState("30")

  const reports = [
    {
      id: "fraud-summary",
      title: "Fraud Detection Summary",
      description: "Comprehensive fraud analysis and detection metrics",
      lastGenerated: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: "transaction-analysis",
      title: "Transaction Analysis Report",
      description: "Detailed transaction patterns and anomaly detection",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
    },
    {
      id: "credit-assessment",
      title: "Credit Risk Assessment",
      description: "Credit scoring and risk evaluation report",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
    },
    {
      id: "compliance-audit",
      title: "Compliance Audit Report",
      description: "Regulatory compliance and audit trail documentation",
      lastGenerated: "2024-01-12",
      size: "4.2 MB",
    },
  ]

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId} for ${dateRange} days`)
    // Simulate report generation
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Reports Header */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">System Reports</h3>
                <p className="text-sm text-slate-500">Generate and download detailed reports</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-slate-500">Reports Generated</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-slate-500">Data Points</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-slate-500">Accuracy Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">12.3 MB</div>
              <div className="text-sm text-slate-500">Total Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{report.title}</h3>
                  <p className="text-sm text-slate-500">{report.description}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Generated:</span>
                  <span className="font-medium text-slate-700">{report.lastGenerated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-medium text-slate-700">{report.size}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => generateReport(report.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Custom Report Builder</h3>
              <p className="text-sm text-slate-500">Create personalized reports with specific parameters</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <option>Fraud Analysis</option>
                <option>Transaction Summary</option>
                <option>Risk Assessment</option>
                <option>Performance Metrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date From</label>
              <Input type="date" className="bg-slate-50 border-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date To</label>
              <Input type="date" className="bg-slate-50 border-slate-200" />
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            Generate Custom Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

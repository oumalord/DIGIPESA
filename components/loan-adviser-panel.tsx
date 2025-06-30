"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LoanAdviserPanel() {
  const [selectedLoan, setSelectedLoan] = useState(null)

  const loanOffers = [
    {
      id: 1,
      bank: "Chase Bank",
      type: "Personal Loan",
      amount: 25000,
      rate: 6.5,
      term: 60,
      approval: 95,
      monthly: 489,
      features: ["No prepayment penalty", "Fast approval", "Flexible terms"],
    },
    {
      id: 2,
      bank: "Wells Fargo",
      type: "Personal Loan",
      amount: 25000,
      rate: 7.2,
      term: 60,
      approval: 88,
      monthly: 501,
      features: ["Relationship discount", "Online management", "Fixed rate"],
    },
    {
      id: 3,
      bank: "Bank of America",
      type: "Personal Loan",
      amount: 25000,
      rate: 6.8,
      term: 60,
      approval: 92,
      monthly: 495,
      features: ["Preferred rewards", "No origination fee", "Quick funding"],
    },
  ]

  const getApprovalColor = (approval: number) => {
    if (approval >= 90) return "text-green-400"
    if (approval >= 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Loan Recommendations Header */}
      <Card className="bg-gray-800/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>AI Loan Adviser</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">$25,000</div>
              <div className="text-sm text-gray-400">Recommended Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">6.5%</div>
              <div className="text-sm text-gray-400">Best Rate Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">95%</div>
              <div className="text-sm text-gray-400">Approval Chance</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
            <h3 className="font-semibold mb-2">AI Recommendation</h3>
            <p className="text-sm text-gray-300">
              Based on your credit score of 742 and income analysis, you qualify for premium rates. Chase Bank offers
              the best combination of low rate and high approval probability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loan Offers */}
      <div className="space-y-4">
        {loanOffers.map((loan) => (
          <Card
            key={loan.id}
            className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{loan.bank}</h3>
                  <p className="text-gray-400">{loan.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{loan.rate}% APR</div>
                  <div className={`text-sm ${getApprovalColor(loan.approval)}`}>{loan.approval}% Approval Chance</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Loan Amount</div>
                  <div className="font-semibold">${loan.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Term</div>
                  <div className="font-semibold">{loan.term} months</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Monthly Payment</div>
                  <div className="font-semibold">${loan.monthly}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Interest</div>
                  <div className="font-semibold">${(loan.monthly * loan.term - loan.amount).toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {loan.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20 bg-transparent"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

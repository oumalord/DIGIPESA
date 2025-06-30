"use client"

// Enhanced Database Schema
export interface User {
  id: string
  email: string
  password: string
  pin: string // 4-digit PIN for transactions
  role: "user" | "operator" | "admin"
  name: string
  phone: string
  nationalId: string
  income: number
  creditScore: number
  accountBalance: number
  clearanceLevel: number
  registrationFee: number
  accountStatus: "active" | "flagged" | "suspended"
  flaggedUntil?: Date // When the flag expires (12 hours)
  flaggedBy?: string // Who flagged the account
  flaggedReason?: string // Reason for flagging
  createdAt: Date
  lastLogin?: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: "transfer" | "withdrawal" | "purchase" | "deposit" | "loan" | "savings"
  category: string
  description: string
  date: Date
  location?: string
  suspicious: boolean
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  operatorId?: string // Track which operator processed the transaction
}

export interface FraudReport {
  id: string
  reportedBy: string // User ID who reported
  reporterRole: "user" | "operator" | "admin"
  accountId: string // Account being reported
  transactionId?: string
  amount: number
  description: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  status: "pending" | "investigating" | "resolved" | "flagged"
  reportDate: Date
  reviewedBy?: string // Admin who reviewed
  reviewDate?: Date
  actionTaken?: string
}

export interface SecurityAlert {
  id: string
  userId: string
  alertType: "fraud" | "suspicious_login" | "unusual_transaction" | "security_breach"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  message: string
  details: string
  timestamp: Date
  status: "active" | "investigating" | "resolved"
  assignedTo?: string
}

export interface LoanApplication {
  id: string
  userId: string
  amount: number
  purpose: string
  status: "pending" | "approved" | "rejected"
  appliedDate: Date
  approvedBy?: string
}

export interface DepositRequest {
  id: string
  userId: string
  amount: number
  method: string
  status: "pending" | "approved" | "rejected"
  requestDate: Date
  approvedBy?: string
}

// Enhanced Mock Users Database with PINs
export const users: User[] = [
  {
    id: "1",
    email: "brianmageto@digipesa.com",
    password: "Brian@2001",
    pin: "1234",
    role: "user",
    name: "Brian Mageto",
    phone: "+254712345678",
    nationalId: "12345678",
    income: 75000,
    creditScore: 742,
    accountBalance: 15420.5,
    clearanceLevel: 3,
    registrationFee: 500,
    accountStatus: "active",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "obwandalordphick@digipesa.com",
    password: "JESUS39814057",
    pin: "5678",
    role: "admin",
    name: "Obwanda Lord Phick",
    phone: "+254712345679",
    nationalId: "87654321",
    income: 0,
    creditScore: 0,
    accountBalance: 0,
    clearanceLevel: 5,
    registrationFee: 0,
    accountStatus: "active",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    email: "harietbeverlyne@digipesa.com",
    password: "Hariet@345",
    pin: "9876",
    role: "operator",
    name: "Hariet Beverlyne",
    phone: "+254712345680",
    nationalId: "11223344",
    income: 95000,
    creditScore: 775,
    accountBalance: 0,
    clearanceLevel: 4,
    registrationFee: 500,
    accountStatus: "active",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "4",
    email: "ojiambofloh@digipesa.com",
    password: "Ojiambo@2002",
    pin: "2002",
    role: "user",
    name: "Ojiambo Floh",
    phone: "+254712345681",
    nationalId: "22334455",
    income: 65000,
    creditScore: 720,
    accountBalance: 8750.25,
    clearanceLevel: 3,
    registrationFee: 500,
    accountStatus: "active",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
]

// Mock Transactions Database
export const transactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    amount: -1200,
    type: "transfer",
    category: "Transfer",
    description: "Transfer to John Doe",
    date: new Date("2024-01-15"),
    suspicious: false,
    status: "approved",
  },
  {
    id: "2",
    userId: "1",
    amount: -500,
    type: "withdrawal",
    category: "ATM Withdrawal",
    description: "ATM Withdrawal",
    date: new Date("2024-01-14"),
    suspicious: false,
    status: "approved",
  },
  {
    id: "3",
    userId: "1",
    amount: -250,
    type: "purchase",
    category: "Shopping",
    description: "Online Purchase",
    date: new Date("2024-01-13"),
    suspicious: false,
    status: "approved",
  },
]

// Fraud Reports Database
export const fraudReports: FraudReport[] = [
  {
    id: "1",
    reportedBy: "1",
    reporterRole: "user",
    accountId: "#4521",
    transactionId: "TXN123456",
    amount: 2450,
    description: "Unauthorized transaction from unknown location",
    riskLevel: "HIGH",
    status: "pending",
    reportDate: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    reportedBy: "3",
    reporterRole: "operator",
    accountId: "#7832",
    amount: 890,
    description: "Suspicious multiple small transactions",
    riskLevel: "MEDIUM",
    status: "investigating",
    reportDate: new Date("2024-01-14T14:20:00"),
    reviewedBy: "2",
    reviewDate: new Date("2024-01-14T15:00:00"),
  },
]

// TEMP compatibility export for legacy components that still import `fraudAlerts`.
export const fraudAlerts = fraudReports

// Security Alerts Database
export const securityAlerts: SecurityAlert[] = [
  {
    id: "1",
    userId: "1",
    alertType: "fraud",
    severity: "HIGH",
    message: "Multiple failed login attempts detected",
    details: "5 failed login attempts from IP: 192.168.1.100 in the last 10 minutes",
    timestamp: new Date(),
    status: "active",
  },
  {
    id: "2",
    userId: "4",
    alertType: "unusual_transaction",
    severity: "MEDIUM",
    message: "Large transaction outside normal pattern",
    details: "Transaction of KES 50,000 - 300% above user's average transaction amount",
    timestamp: new Date(),
    status: "investigating",
    assignedTo: "2",
  },
]

// Mock Loan Applications
export const loanApplications: LoanApplication[] = [
  {
    id: "1",
    userId: "1",
    amount: 50000,
    purpose: "Business expansion",
    status: "pending",
    appliedDate: new Date(),
  },
]

// Mock Deposit Requests
export const depositRequests: DepositRequest[] = [
  {
    id: "1",
    userId: "1",
    amount: 5000,
    method: "Bank Transfer",
    status: "pending",
    requestDate: new Date(),
  },
]

// Database Functions
export const authenticateUser = (email: string, password: string): User | null => {
  const user = users.find((user) => user.email === email && user.password === password)
  if (user) {
    user.lastLogin = new Date()

    // Check if account is flagged and if flag has expired
    if (user.accountStatus === "flagged" && user.flaggedUntil) {
      if (new Date() > user.flaggedUntil) {
        // Flag has expired, reactivate account
        user.accountStatus = "active"
        user.flaggedUntil = undefined
        user.flaggedBy = undefined
        user.flaggedReason = undefined
      }
    }
  }
  return user || null
}

export const verifyUserPin = (userId: string, pin: string): boolean => {
  const user = users.find((user) => user.id === userId)
  return user ? user.pin === pin : false
}

export const verifyOperatorPin = (operatorId: string, pin: string): boolean => {
  const operator = users.find((user) => user.id === operatorId && (user.role === "operator" || user.role === "admin"))
  return operator ? operator.pin === pin : false
}

export const getUserById = (id: string): User | null => {
  return users.find((user) => user.id === id) || null
}

export const getUserByEmail = (email: string): User | null => {
  return users.find((user) => user.email === email) || null
}

export const getAllUsers = (): User[] => {
  return users
}

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates }
    return users[userIndex]
  }
  return null
}

export const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date(),
  }
  users.push(newUser)
  return newUser
}

export const getUserTransactions = (userId: string): Transaction[] => {
  return transactions.filter((transaction) => transaction.userId === userId)
}

export const createTransaction = (transactionData: Omit<Transaction, "id">): Transaction => {
  const newTransaction: Transaction = {
    ...transactionData,
    id: `txn_${Date.now()}`,
  }
  transactions.push(newTransaction)
  return newTransaction
}

// Fraud Report Functions
export const createFraudReport = (reportData: Omit<FraudReport, "id" | "reportDate">): FraudReport => {
  const newReport: FraudReport = {
    ...reportData,
    id: `fraud_${Date.now()}`,
    reportDate: new Date(),
  }
  fraudReports.push(newReport)
  return newReport
}

export const getAllFraudReports = (): FraudReport[] => {
  return fraudReports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime())
}

export const getFraudReportById = (id: string): FraudReport | null => {
  return fraudReports.find((report) => report.id === id) || null
}

export const updateFraudReport = (id: string, updates: Partial<FraudReport>): FraudReport | null => {
  const reportIndex = fraudReports.findIndex((report) => report.id === id)
  if (reportIndex !== -1) {
    fraudReports[reportIndex] = { ...fraudReports[reportIndex], ...updates }
    return fraudReports[reportIndex]
  }
  return null
}

// Flag Account Function
export const flagAccountFromReport = (reportId: string, adminId: string, reason: string): boolean => {
  const report = getFraudReportById(reportId)
  if (!report) return false

  // Find user by account ID (assuming account ID format #XXXX maps to user ID)
  const accountNumber = report.accountId.replace("#", "")
  const user = users.find((u) => u.id === accountNumber || u.nationalId === accountNumber)

  if (!user) return false

  // Flag the account for 12 hours
  const flaggedUntil = new Date()
  flaggedUntil.setHours(flaggedUntil.getHours() + 12)

  updateUser(user.id, {
    accountStatus: "flagged",
    flaggedUntil,
    flaggedBy: adminId,
    flaggedReason: reason,
  })

  // Update the fraud report
  updateFraudReport(reportId, {
    status: "flagged",
    reviewedBy: adminId,
    reviewDate: new Date(),
    actionTaken: `Account flagged for 12 hours - ${reason}`,
  })

  return true
}

// Security Alert Functions
export const createSecurityAlert = (alertData: Omit<SecurityAlert, "id" | "timestamp">): SecurityAlert => {
  const newAlert: SecurityAlert = {
    ...alertData,
    id: `alert_${Date.now()}`,
    timestamp: new Date(),
  }
  securityAlerts.push(newAlert)
  return newAlert
}

export const getAllSecurityAlerts = (): SecurityAlert[] => {
  return securityAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const getActiveSecurityAlerts = (): SecurityAlert[] => {
  return securityAlerts.filter((alert) => alert.status === "active")
}

export const updateSecurityAlert = (id: string, updates: Partial<SecurityAlert>): SecurityAlert | null => {
  const alertIndex = securityAlerts.findIndex((alert) => alert.id === id)
  if (alertIndex !== -1) {
    securityAlerts[alertIndex] = { ...securityAlerts[alertIndex], ...updates }
    return securityAlerts[alertIndex]
  }
  return null
}

// Get Flagged Accounts
export const getFlaggedAccounts = (): User[] => {
  return users.filter((user) => user.accountStatus === "flagged")
}

// Get High Risk Accounts (based on multiple criteria)
export const getHighRiskAccounts = (): User[] => {
  return users.filter((user) => {
    const userReports = fraudReports.filter(
      (report) => report.accountId.includes(user.id) || report.accountId.includes(user.nationalId),
    )
    const hasHighRiskReports = userReports.some(
      (report) => report.riskLevel === "HIGH" || report.riskLevel === "CRITICAL",
    )
    const hasMultipleReports = userReports.length >= 2
    const hasLowCreditScore = user.creditScore < 600

    return hasHighRiskReports || hasMultipleReports || hasLowCreditScore
  })
}

export const createLoanApplication = (loanData: Omit<LoanApplication, "id">): LoanApplication => {
  const newLoan: LoanApplication = {
    ...loanData,
    id: `loan_${Date.now()}`,
  }
  loanApplications.push(newLoan)
  return newLoan
}

export const getLoanApplications = (userId?: string): LoanApplication[] => {
  return userId ? loanApplications.filter((loan) => loan.userId === userId) : loanApplications
}

export const getDepositRequests = (userId?: string): DepositRequest[] => {
  return userId ? depositRequests.filter((deposit) => deposit.userId === userId) : depositRequests
}

export const approveDeposit = (depositId: string, approvedBy: string): DepositRequest | null => {
  const depositIndex = depositRequests.findIndex((deposit) => deposit.id === depositId)
  if (depositIndex !== -1) {
    depositRequests[depositIndex].status = "approved"
    depositRequests[depositIndex].approvedBy = approvedBy

    // Add amount to user's balance
    const deposit = depositRequests[depositIndex]
    const user = getUserById(deposit.userId)
    if (user) {
      updateUser(user.id, { accountBalance: user.accountBalance + deposit.amount })
    }

    return depositRequests[depositIndex]
  }
  return null
}

export const flagUser = (userId: string, flaggedBy: string): User | null => {
  const flaggedUntil = new Date()
  flaggedUntil.setHours(flaggedUntil.getHours() + 12)

  return updateUser(userId, {
    accountStatus: "flagged",
    flaggedUntil,
    flaggedBy,
    flaggedReason: "Flagged by operator",
  })
}

export const calculateExpenseBreakdown = (income: number, transactions: Transaction[]) => {
  const basePercentages = {
    Housing: 0.3,
    Food: 0.15,
    Transportation: 0.12,
    Entertainment: 0.08,
    Utilities: 0.05,
    Healthcare: 0.08,
    Savings: 0.2,
    Other: 0.02,
  }

  // Adjust percentages based on income level
  const adjustedPercentages = { ...basePercentages }

  if (income < 50000) {
    // Lower income - higher housing and food percentage
    adjustedPercentages.Housing = 0.35
    adjustedPercentages.Food = 0.2
    adjustedPercentages.Entertainment = 0.05
    adjustedPercentages.Savings = 0.1
  } else if (income > 100000) {
    // Higher income - more savings and entertainment
    adjustedPercentages.Housing = 0.25
    adjustedPercentages.Entertainment = 0.12
    adjustedPercentages.Savings = 0.25
    adjustedPercentages.Healthcare = 0.1
  }

  const monthlyIncome = income / 12
  const expenseData = Object.entries(adjustedPercentages).map(([category, percentage], index) => ({
    name: category,
    value: Math.round(monthlyIncome * percentage),
    color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"][index],
  }))

  return expenseData
}

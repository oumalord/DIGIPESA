"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, authenticateUser, getUserById } from "@/lib/database"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUserId = localStorage.getItem("digipesa_user_id")
    if (storedUserId) {
      const foundUser = getUserById(storedUserId)
      if (foundUser) {
        setUser(foundUser)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const authenticatedUser = authenticateUser(email, password)
    if (authenticatedUser) {
      setUser(authenticatedUser)
      localStorage.setItem("digipesa_user_id", authenticatedUser.id)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("digipesa_user_id")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

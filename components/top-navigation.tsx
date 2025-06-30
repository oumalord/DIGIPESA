"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Bell, Settings, Search, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function TopNavigation() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image src="/images/digipesa-logo.jpg" alt="DIGIPESA Logo" fill className="object-contain rounded-lg" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-slate-800">DIGIPESA</h1>
            <p className="text-xs text-slate-500">Digital Finance</p>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
            Analytics
          </a>
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
            Reports
          </a>
          <a href="#" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
            Settings
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 lg:w-64 bg-slate-50 border-slate-200 focus:border-blue-500"
              />
            </div>
          </form>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-800">{user?.name}</div>
              <div className="text-xs text-slate-500">Level {user?.clearanceLevel}</div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              <User className="w-5 h-5" />
            </Button>
          </div>

          {/* Logout */}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-red-600 hidden sm:flex"
          >
            <LogOut className="w-5 h-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-slate-50 border-slate-200 focus:border-blue-500"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <a
                href="#"
                className="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Analytics
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Reports
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Settings
              </a>
            </nav>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500">Security Level {user?.clearanceLevel}</div>
                </div>
                <Button onClick={logout} variant="ghost" size="sm" className="text-slate-600 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

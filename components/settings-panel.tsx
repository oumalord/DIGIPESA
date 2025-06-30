"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Settings, User, Shield, Bell, Database, Key } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export function SettingsPanel() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    fraudAlerts: true,
    systemUpdates: true,
    reportGeneration: false,
    maintenanceMode: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "3",
  })

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Settings Header */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">System Settings</h3>
              <p className="text-sm text-slate-500">Configure security and system preferences</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-xl font-bold text-green-600">Level {user?.clearanceLevel}</div>
              <div className="text-sm text-slate-500">Security Clearance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-xl font-bold text-blue-600">{user?.role.toUpperCase()}</div>
              <div className="text-sm text-slate-500">Access Role</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-xl font-bold text-purple-600">
                {user?.role === "admin" ? "FULL ACCESS" : "Active"}
              </div>
              <div className="text-sm text-slate-500">
                {user?.role === "admin" ? "System Access" : "Session Status"}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-slate-500">
                {user?.role === "admin" ? "System Monitoring" : "Monitoring"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Profile Settings</h3>
              <p className="text-sm text-slate-500">Manage your account information</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <Input defaultValue={user?.name} className="bg-slate-50 border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <Input defaultValue={user?.email} className="bg-slate-50 border-slate-200" />
              </div>
              {user?.role !== "admin" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income</label>
                  <Input defaultValue={`$${user?.income?.toLocaleString()}`} className="bg-slate-50 border-slate-200" />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Security Clearance</label>
                <Input
                  defaultValue={`Level ${user?.clearanceLevel}`}
                  disabled
                  className="bg-slate-100 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Role</label>
                <Input defaultValue={user?.role.toUpperCase()} disabled className="bg-slate-100 border-slate-200" />
              </div>
              {user?.role !== "admin" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account Balance</label>
                  <Input
                    defaultValue={`$${user?.accountBalance?.toLocaleString()}`}
                    disabled
                    className="bg-slate-100 border-slate-200"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Security Configuration</h3>
              <p className="text-sm text-slate-500">Advanced security and authentication settings</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">Two-Factor Authentication</div>
                  <div className="text-sm text-slate-500">Enhanced login security</div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                <Input
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password Expiry (days)</label>
                <Input
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
                <Input
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent">
              Reset Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3>
              <p className="text-sm text-slate-500">Configure alert and notification settings</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">Fraud Alerts</div>
                <div className="text-sm text-slate-500">Real-time fraud detection notifications</div>
              </div>
              <Switch
                checked={notifications.fraudAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, fraudAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">System Updates</div>
                <div className="text-sm text-slate-500">Platform updates and maintenance alerts</div>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">Report Generation</div>
                <div className="text-sm text-slate-500">Notifications when reports are ready</div>
              </div>
              <Switch
                checked={notifications.reportGeneration}
                onCheckedChange={(checked) => setNotifications({ ...notifications, reportGeneration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">Maintenance Mode</div>
                <div className="text-sm text-slate-500">System maintenance and downtime alerts</div>
              </div>
              <Switch
                checked={notifications.maintenanceMode}
                onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceMode: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Database Configuration</h3>
              <p className="text-sm text-slate-500">System database and storage settings</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-slate-500">Database Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-xl font-bold text-blue-600">2.4TB</div>
              <div className="text-sm text-slate-500">Storage Used</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-slate-500">Active Records</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-xl font-bold text-orange-600">15ms</div>
              <div className="text-sm text-slate-500">Query Time</div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Backup Database</Button>
            <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent">
              Optimize Performance
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent">
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

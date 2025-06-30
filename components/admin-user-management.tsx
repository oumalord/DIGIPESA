"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getAllUsers, createUser, updateUser, getUserByEmail } from "@/lib/database"
import { Users, UserPlus, Edit, Search, Eye, EyeOff, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminUserManagement() {
  const { user: admin } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    pin: "",
    phone: "",
    nationalId: "",
    role: "user",
    income: "",
    clearanceLevel: 3,
    accountBalance: "",
  })

  const [editUserData, setEditUserData] = useState({})

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterRole, filterStatus])

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  const filterUsers = () => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.nationalId.includes(searchTerm),
      )
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.accountStatus === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = async () => {
    try {
      // Validate required fields
      if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.pin) {
        alert("Please fill in all required fields")
        return
      }

      // Check if email already exists
      if (getUserByEmail(newUserData.email)) {
        alert("Email already exists in the system")
        return
      }

      // Validate PIN
      if (newUserData.pin.length !== 4 || !/^\d{4}$/.test(newUserData.pin)) {
        alert("PIN must be exactly 4 digits")
        return
      }

      const userData = {
        ...newUserData,
        income: Number.parseFloat(newUserData.income) || 0,
        accountBalance: Number.parseFloat(newUserData.accountBalance) || 0,
        creditScore: 650, // Default credit score
        registrationFee: newUserData.role === "user" ? 500 : 0,
        accountStatus: "active",
      }

      createUser(userData)
      loadUsers()
      setIsAddingUser(false)
      setNewUserData({
        name: "",
        email: "",
        password: "",
        pin: "",
        phone: "",
        nationalId: "",
        role: "user",
        income: "",
        clearanceLevel: 3,
        accountBalance: "",
      })
      alert("User created successfully!")
    } catch (error) {
      alert("Failed to create user. Please try again.")
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditUserData({
      ...user,
      password: "••••••••", // Mask password
    })
    setIsEditing(true)
  }

  const handleUpdateUser = async () => {
    try {
      const updates = { ...editUserData }

      // Don't update password if it's still masked
      if (updates.password === "••••••••") {
        delete updates.password
      }

      // Validate PIN if changed
      if (updates.pin && (updates.pin.length !== 4 || !/^\d{4}$/.test(updates.pin))) {
        alert("PIN must be exactly 4 digits")
        return
      }

      // Convert numeric fields
      if (updates.income) updates.income = Number.parseFloat(updates.income)
      if (updates.accountBalance) updates.accountBalance = Number.parseFloat(updates.accountBalance)
      if (updates.clearanceLevel) updates.clearanceLevel = Number.parseInt(updates.clearanceLevel)

      updateUser(selectedUser.id, updates)
      loadUsers()
      setIsEditing(false)
      setSelectedUser(null)
      alert("User updated successfully!")
    } catch (error) {
      alert("Failed to update user. Please try again.")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700"
      case "operator":
        return "bg-blue-100 text-blue-700"
      case "user":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "flagged":
        return "bg-red-100 text-red-700"
      case "suspended":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">User Management</h3>
                <p className="text-sm text-slate-500">Comprehensive user administration and control</p>
              </div>
            </div>
            <Button onClick={() => setIsAddingUser(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-slate-500">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.accountStatus === "active").length}
              </div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.accountStatus === "flagged").length}
              </div>
              <div className="text-sm text-slate-500">Flagged Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.role === "admin" || u.role === "operator").length}
              </div>
              <div className="text-sm text-slate-500">Staff Members</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="operator">Operators</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="flagged">Flagged</option>
                <option value="suspended">Suspended</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswords(!showPasswords)}
                className="bg-transparent border-slate-300"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">User Details</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Role & Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Financial</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Security</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        <div className="text-xs text-slate-400">ID: {user.nationalId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="text-slate-700">{user.phone}</div>
                        <div className="text-slate-500">Joined: {user.createdAt?.toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.accountStatus)}`}
                          >
                            {user.accountStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="text-slate-700">Balance: {formatCurrency(user.accountBalance)}</div>
                        <div className="text-slate-500">Income: {formatCurrency(user.income)}</div>
                        <div className="text-slate-500">Credit: {user.creditScore}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="text-slate-700">Level {user.clearanceLevel}</div>
                        <div className="text-slate-500">PIN: {showPasswords ? user.pin : "••••"}</div>
                        <div className="text-slate-500">Pass: {showPasswords ? user.password : "••••••••"}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                        className="bg-transparent border-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  <span>Add New User</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingUser(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <Input
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      placeholder="user@example.com"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                    <Input
                      type="password"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      placeholder="Create password"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">4-Digit PIN *</label>
                    <Input
                      type="password"
                      value={newUserData.pin}
                      onChange={(e) =>
                        setNewUserData({ ...newUserData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      placeholder="1234"
                      maxLength={4}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <Input
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                      placeholder="+254712345678"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">National ID</label>
                    <Input
                      value={newUserData.nationalId}
                      onChange={(e) => setNewUserData({ ...newUserData, nationalId: e.target.value })}
                      placeholder="Enter national ID"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (KES)</label>
                    <Input
                      type="number"
                      value={newUserData.income}
                      onChange={(e) => setNewUserData({ ...newUserData, income: e.target.value })}
                      placeholder="0"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Security Clearance Level</label>
                    <select
                      value={newUserData.clearanceLevel}
                      onChange={(e) =>
                        setNewUserData({ ...newUserData, clearanceLevel: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                      <option value={4}>Level 4</option>
                      <option value={5}>Level 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Initial Balance (KES)</label>
                    <Input
                      type="number"
                      value={newUserData.accountBalance}
                      onChange={(e) => setNewUserData({ ...newUserData, accountBalance: e.target.value })}
                      placeholder="0"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <Button onClick={handleAddUser} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Create User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingUser(false)}
                  className="bg-transparent border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <span>Edit User: {selectedUser.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <Input
                      value={editUserData.name || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={editUserData.email || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <Input
                      type="password"
                      value={editUserData.password || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">4-Digit PIN</label>
                    <Input
                      type="password"
                      value={editUserData.pin || ""}
                      onChange={(e) =>
                        setEditUserData({ ...editUserData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                      }
                      maxLength={4}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <Input
                      value={editUserData.phone || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">National ID</label>
                    <Input
                      value={editUserData.nationalId || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, nationalId: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                    <select
                      value={editUserData.role || "user"}
                      onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Status</label>
                    <select
                      value={editUserData.accountStatus || "active"}
                      onChange={(e) => setEditUserData({ ...editUserData, accountStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="active">Active</option>
                      <option value="flagged">Flagged</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (KES)</label>
                    <Input
                      type="number"
                      value={editUserData.income || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, income: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Balance (KES)</label>
                    <Input
                      type="number"
                      value={editUserData.accountBalance || ""}
                      onChange={(e) => setEditUserData({ ...editUserData, accountBalance: e.target.value })}
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Security Clearance Level</label>
                    <select
                      value={editUserData.clearanceLevel || 3}
                      onChange={(e) =>
                        setEditUserData({ ...editUserData, clearanceLevel: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                      <option value={4}>Level 4</option>
                      <option value={5}>Level 5</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Update User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-transparent border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

'use client'

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token)
  if (!payload?.exp) return true
  return Date.now() > payload.exp * 1000
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [userData, setUserData] = useState({ subscriptions: [] })
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
    setUserData({ subscriptions: [] })
    setAnalytics(null)
    localStorage.removeItem("token")
  }

  async function refreshSubscriptionsAndAnalytics() {
    setLoading(true)

    try {
      const [subsRes, analyticsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ])

      let subsData = []
      let analyticsData = null

      if (subsRes.status === 401) {
        console.warn("🟡 Subscriptions fetch unauthorized – possibly no token yet or new user")
      } else if (subsRes.ok) {
        subsData = await subsRes.json()
      } else {
        console.error("❌ Subscriptions fetch error:", subsRes.status)
      }

      if (analyticsRes === 401) {
        console.warn("🟡 Analytics fetch unauthorized – possibly no token yet or new user")
      } else if (analyticsRes.ok) {
        analyticsData = await analyticsRes.json()
      } else {
        console.warn("⚠️ Analytics fetch failed:", analyticsRes.status)
      }

      setUserData({ subscriptions: subsData })
      setAnalytics(analyticsData)
    } catch (err) {
      console.error("❌ Error loading dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }



  async function login(email, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) throw new Error("Login failed")

    const data = await res.json()
    setToken(data.token)
    localStorage.setItem("token", data.token)

    const userInfo = parseJwt(data.token)
    setCurrentUser({ email: userInfo.email, userId: userInfo.sub })

    await refreshSubscriptionsAndAnalytics()
  }

  async function signup(email, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("Signup error:", err)
      throw new Error("Signup failed")
    }
  }

  async function handleAddSubscription(newSub) {
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSub)
      })

      if (!res.ok) throw new Error("Failed to add")

      await refreshSubscriptionsAndAnalytics()
    } catch (err) {
      console.error("❌ Error adding sub:", err)
    }
  }

  async function handleDeleteSubscription(id) {
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Failed to delete")
      await refreshSubscriptionsAndAnalytics()
    } catch (err) {
      console.error("❌ Error deleting sub:", err)
    }
  }

  async function handleUpdateSubscription(id, updatedSub) {
    if (!token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedSub)
      })

      if (!res.ok) throw new Error("Failed to update")
      await refreshSubscriptionsAndAnalytics()
    } catch (err) {
      console.error("❌ Error updating sub:", err)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken || isTokenExpired(storedToken)) {
      logout()
      return
    }

    const userInfo = parseJwt(storedToken)
    setCurrentUser({ email: userInfo.email, userId: userInfo.sub })
    setToken(storedToken) // ✅ trigger below useEffect
  }, [])

  // 🔁 Run API fetch *after* token is set
  useEffect(() => {
    if (token) {
      refreshSubscriptionsAndAnalytics()
    }
  }, [token])


  const value = {
    currentUser,
    token,
    userData,
    analytics,
    loading,
    login,
    logout,
    signup,
    handleAddSubscription,
    handleDeleteSubscription,
    handleUpdateSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

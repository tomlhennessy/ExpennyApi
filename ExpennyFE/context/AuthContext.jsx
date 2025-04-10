'use client'

import { auth, db } from "@/firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useContext, useState, useEffect, createContext } from "react"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))

    return JSON.parse(jsonPayload)
  } catch (err) {
    return null
  }
}


export function AuthProvider(props) {
    const { children } = props

    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState({ subscriptions: []})
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)

    async function signup(email, password) {
      const res = await fetch("https://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) throw new Error("Signup failed")
    }

    async function login(email, password) {
        try {
          const res = await fetch("https://localhost:5001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          })

          if (!res.ok) throw new Error("Login failed")

          const data = await res.json()
          setToken(data.token)

          const userInfo = parseJwt(data.token)
          setCurrentUser({ email: userInfo.email, userId: userInfo.sub })

          localStorage.setItem("token", data.token)
        } catch (err) {
          console.error("Login error:", err.message)
          throw err
        }
    }

    function logout() {
          setToken(null)
          setCurrentUser(null)
          setUserData({ subscriptions: [] })
          localStorage.removeItem("token")
    }

    async function handleAddSubscription(newSubscription) {
      if (!token) return

      try {
        const res = await fetch('https://localhost:5001/api/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newSubscription)
        })

        if (!res.ok) throw new Error('Failed to add sub')

        const data = await res.json()
        console.log("✅ Sub added:", data)
      } catch (err) {
        console.error("❌ Error adding subscription:", err)
      }
    }



    async function handleDeleteSubscription(subId) {
      if (!token || !subId) {
        console.error("Missing token or subId")
        return
      }

      try {
        const res = await fetch(`https://localhost:5001/api/subscriptions/${subId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Failed to delete')

        console.log("🗑️ Deleted subscription ID:", subId)

        // 🔄 Re-fetch updated list
        const refresh = await fetch(`http://localhost:5001/api/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

    const updatedSubs = await refresh.json()
    setUserData({ subscriptions: updatedSubs })

      } catch (err) {
        console.error("❌ Error deleting:", err)
      }
    }

    async function handleUpdateSubscription(id, updatedData) {
      if (!token) {
        console.error("Missing token for update")
        return
      }

      try {
        const res = await fetch(`https://localhost:5001/api/subscriptions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        })

        if (!res.ok) throw new Error("Failed to update subscription")

        console.log("✅ PUT request successful")

        // 🔄 Refresh data
        const refresh = await fetch(`https://localhost:5001/api/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const updatedSubs = await refresh.json()
        setUserData({ subscriptions: updatedSubs })

      } catch (err) {
        console.error("❌ Error updating subscription:", err)
      }
    }



    useEffect(() => {
      const storedToken = localStorage.getItem("token")
      if (!storedToken) return

      const userInfo = parseJwt(storedToken)
      if (!userInfo) return

      setToken(storedToken)
      setCurrentUser({ email: userInfo.email, userId: userInfo.sub })

      fetch(`https://localhost:5001/api/subscriptions`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUserData({ subscriptions: data })
        })
    }, [])



    const value = {
        currentUser, userData, loading, signup, login, logout, handleAddSubscription, handleDeleteSubscription, handleUpdateSubscription
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

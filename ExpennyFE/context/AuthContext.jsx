'use client'

import { auth, db } from "@/firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useContext, useState, useEffect, createContext } from "react"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider(props) {
    const { children } = props

    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState({ subscriptions: []})
    const [loading, setLoading] = useState(false)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    async function logout() {
        try {
            await signOut(auth)
            setCurrentUser(null)
            setUserData({ subscriptions: [] })
        } catch (err) {
            console.log('Logout error:', err.message)
        }
    }


    // async function saveToFirebase(data) {
    //     if (!currentUser) {
    //       console.log("❌ No currentUser inside saveToFirebase")
    //       return
    //     }

    //     try {
    //       const userRef = doc(db, 'users', currentUser.uid)
    //       await setDoc(userRef, { subscriptions: data }, { merge: true })
    //       console.log("✅ Saved to Firestore")
    //     } catch (err) {
    //       console.error("❌ Failed to save to Firestore:", err.message)
    //     }
    // }



    async function handleAddSubscription(newSubscription) {
        if (!currentUser) {
          console.log("🚫 Tried to add subscription but currentUser is null")
          return
        }
        // OLD:
        // const newSubscriptions = [...userData.subscriptions, newSubscription]
        // setUserData({ subscriptions: newSubscriptions })
        // await saveToFirebase(newSubscriptions)

        // New:
        try {
          const res = await fetch('http://localhost:5001/api/subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSubscription)
          })

          if (!res.ok) throw new Error('Failed to add sub')

          const data = await res.json()
          console.log("Sub added:", data)
        } catch (err) {
          console.error("Error:", err)
        }
    }


    async function handleDeleteSubscription(index) {
        const subId = userData.subscriptions[index].id
        if (!subId) {
          console.error("No subId found")
          return
        }

        try {
          const res = await fetch(`http://localhost:5001/api/subscriptions/${subId}`, {
            method: 'DELETE'
          })

          if (!res.ok) throw new Error('Failed to delete')

          console.log("Deleted subscription ID:", subId)

          // OPTIONAL: update local state or re-fetch
          // const newSubscriptions = userData.subscriptions.filter((s) => s.id !== subId)
          // setUserData({ subscriptions: newSubscriptions })
        } catch (err) {
          console.error("Error deleting:", err)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {

          setCurrentUser(user)

          if (!user) {
            console.log("🚪 No user - redirecting or staying logged out")
            setUserData({ subscriptions: [] })
            return
          }

          try {
            const hardcodedUserId = "test-user-123" // temporary!
            const res = await fetch(`http://localhost:5001/api/subscriptions/${hardcodedUserId}`)

            if (!res.ok) throw new Error("Failed to fetch subscriptions")

            const data = await res.json()
            setUserData({ subscriptions: data })
            console.log("✅ Loaded subscriptions from API:", data)

          } catch (err) {
            console.error("❌ Error loading subs from API:", err)
          }
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser, userData, loading, signup, login, logout, handleAddSubscription, handleDeleteSubscription
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

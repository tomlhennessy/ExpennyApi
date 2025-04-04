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


    async function saveToFirebase(data) {
        if (!currentUser) {
          console.log("❌ No currentUser inside saveToFirebase")
          return
        }

        try {
          const userRef = doc(db, 'users', currentUser.uid)
          await setDoc(userRef, { subscriptions: data }, { merge: true })
          console.log("✅ Saved to Firestore")
        } catch (err) {
          console.error("❌ Failed to save to Firestore:", err.message)
        }
    }



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
        // delete the entry at that index
        const newSubscriptions = userData.subscriptions.filter((val, valIndex) => {
            return valIndex != index
        })
        setUserData({ subscriptions: newSubscriptions })

        await saveToFirebase(newSubscriptions)
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
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            let firebaseData = { subscriptions: [] }

            if (docSnap.exists()) {
              console.log("✅ User data found in Firestore")
              firebaseData = docSnap.data()
            } else {
              console.log("🆕 Creating new user document")
              await setDoc(docRef, firebaseData)
            }

            setUserData(firebaseData)
          } catch (err) {
            console.error("❌ Error loading user data:", err)
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

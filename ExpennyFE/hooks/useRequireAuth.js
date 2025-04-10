// hooks/useRequireAuth.js
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export function useRequireAuth() {
  const { currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/") // or '/login' if you have a login page
    }
  }, [currentUser, router])
}

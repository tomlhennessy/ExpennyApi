'use client'

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function GoTo() {
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const path = usePathname()

  const isAuthenticated = !!currentUser

  // 🔁 Redirect to dashboard if logged in and on homepage
  useEffect(() => {
    if (isAuthenticated && path === '/') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, path, router])

  return (
    <div className="goto">
      {!isAuthenticated && path === '/' && (
        <>
          <Link href="/register"><p>Sign Up</p></Link>
          <Link href="/login"><button>Login →</button></Link>
        </>
      )}

      {isAuthenticated && path === '/dashboard' && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  )
}

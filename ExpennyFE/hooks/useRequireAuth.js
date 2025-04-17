import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export function useRequireAuth() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/") // Redirect only after loading is complete
    }
  }, [loading, currentUser, router]) // ✅ include router here
}

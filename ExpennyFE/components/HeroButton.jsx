'use client'

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function HeroButton() {
  const { currentUser } = useAuth()
  const router = useRouter()

  function handleClick() {
    if (currentUser) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  return (
    <button onClick={handleClick}>
      <h5>Get started &rarr;</h5>
    </button>
  )
}

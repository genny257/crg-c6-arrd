
"use client"

import { useSession, signOut } from "next-auth/react"

export const useAuth = () => {
  const { data: session, status } = useSession()

  const user = session?.user as { name?: string | null, email?: string | null, image?: string | null, role?: string, id?: string } | undefined
  const token = session?.user?.apiToken;
  const loading = status === "loading"

  const logout = () => {
    signOut({ callbackUrl: "/" });
  }

  return { user, token, loading, logout }
}

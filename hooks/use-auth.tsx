"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  email: string | null
  username: string | null
  full_name: string | null
  phone_number: string | null
  birth_date: string | null
  avatar_url: string | null
  role: "basic" | "premium" | "admin"
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isLoggedIn: boolean
  isPremium: boolean
  isAdmin: boolean
  isDeveloper: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      if (!mounted) return

      setIsLoading(true)

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id)
          if (mounted) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        // ログアウト時にホームページにリダイレクト
        router.push("/")
        return
      }

      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        if (mounted) {
          setProfile(profileData)
        }
      } else {
        if (mounted) {
          setProfile(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      }

      // 強制的にステートをクリア
      setUser(null)
      setProfile(null)

      // ホームページにリダイレクト
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLoggedIn = !!user
  const isPremium = profile?.role === "premium" || profile?.role === "admin"
  const isAdmin = profile?.role === "admin"
  const isDeveloper = false // 開発者モードは別途設定

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isLoggedIn,
        isPremium,
        isAdmin,
        isDeveloper,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

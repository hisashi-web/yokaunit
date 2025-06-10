"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

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
        // 現在のセッションを取得
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("Current session:", session ? "exists" : "none")

        if (!mounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          console.log("Loading profile for user:", session.user.email)
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

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("🔄 Auth state changed:", event)

      if (event === "SIGNED_OUT") {
        console.log("User signed out")
        setUser(null)
        setProfile(null)
        return
      }

      if (event === "SIGNED_IN" && session?.user) {
        console.log("✅ User signed in:", session.user.email)
        setUser(session.user)

        // プロフィールを取得
        const profileData = await fetchProfile(session.user.id)
        if (mounted) {
          setProfile(profileData)
        }

        // ユーザー情報をコンソールに表示
        console.log("👤 User Profile:", {
          id: session.user.id,
          email: session.user.email,
          username: profileData?.username,
          fullName: profileData?.full_name,
          role: profileData?.role,
        })
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("🔄 Token refreshed")
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      console.log("🚪 Signing out...")
      setIsLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        toast({
          title: "エラー",
          description: "ログアウトに失敗しました。",
          variant: "destructive",
        })
      } else {
        console.log("✅ Signed out successfully")
        setUser(null)
        setProfile(null)

        toast({
          title: "ログアウト",
          description: "ログアウトしました。",
        })

        // ホームページにリダイレクト（ハッシュを避ける）
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isLoggedIn = !!user
  const isPremium = profile?.role === "premium" || profile?.role === "admin"
  const isAdmin = profile?.role === "admin"
  const isDeveloper = false

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

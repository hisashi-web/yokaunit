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
  ensureProfileExists: (userId: string) => Promise<void>
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

  const ensureProfileExists = async (userId: string) => {
    try {
      // プロフィールを取得
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      // プロフィールが存在しない場合は作成
      if (fetchError && fetchError.code === "PGRST116") {
        const { data: userData } = await supabase.auth.getUser(userId)

        if (!userData.user) {
          console.error("User not found")
          return
        }

        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          email: userData.user.email,
          username:
            userData.user.user_metadata?.name ||
            userData.user.user_metadata?.full_name ||
            userData.user.email?.split("@")[0] ||
            "ユーザー",
          full_name: userData.user.user_metadata?.name || userData.user.user_metadata?.full_name || null,
          avatar_url: userData.user.user_metadata?.avatar_url || null,
          role: "basic",
          is_active: true,
        })

        if (insertError) {
          console.error("Error creating profile:", insertError)
          return
        }

        console.log("Profile created successfully")
      }

      // プロフィールを再取得
      await refreshProfile()
    } catch (error) {
      console.error("Error ensuring profile exists:", error)
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
          // プロフィールが存在することを確認
          await ensureProfileExists(session.user.id)

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

      console.log("Auth state changed:", event)

      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        // ログアウト時にホームページにリダイレクト
        window.location.href = "/"
        return
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (session?.user) {
          setUser(session.user)

          // プロフィールが存在することを確認
          await ensureProfileExists(session.user.id)

          const profileData = await fetchProfile(session.user.id)
          if (mounted) {
            setProfile(profileData)
          }
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
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
        // 強制的にステートをクリア
        setUser(null)
        setProfile(null)

        toast({
          title: "ログアウト",
          description: "ログアウトしました。",
        })

        // ホームページにリダイレクト
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
        ensureProfileExists,
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

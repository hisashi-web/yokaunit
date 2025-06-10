"use client"

import { useEffect, useState } from "react"
import { AdditionalInfoForm } from "@/components/auth/additional-info-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdditionalInfoPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // ログインしていない場合はログインページにリダイレクト
        router.push("/login")
        return
      }

      if (profile && profile.username && profile.phone_number && profile.birth_date) {
        // 必要な情報が揃っている場合はホームページにリダイレクト
        router.push("/")
        return
      }

      setIsChecking(false)
    }
  }, [user, profile, isLoading, router])

  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8 px-4">
      <AdditionalInfoForm
        userId={user.id}
        email={user.email || ""}
        fullName={user.user_metadata?.full_name || profile?.full_name || ""}
      />
    </div>
  )
}

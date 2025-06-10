"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

type Profile = {
  id: string
  username: string
  avatar_url?: string
  role?: string
  // 他にもprofilesテーブルにカラムがあれば追加
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setError("ログインユーザーが見つかりません")
        setLoading(false)
        return
      }

      const userId = session.user.id

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        setError("プロフィールの取得に失敗しました")
        console.error(profileError)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2">読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!profile) {
    return <p>プロフィールが見つかりません。</p>
  }

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">ユーザープロフィール</h2>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>ユーザー名:</strong> {profile.username}</p>
      {profile.role && <p><strong>権限:</strong> {profile.role}</p>}
      {profile.avatar_url && (
        <img
          src={profile.avatar_url}
          alt="ユーザーのアバター"
          className="mt-2 w-20 h-20 rounded-full"
        />
      )}
    </div>
  )
}

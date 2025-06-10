"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Settings, Heart, Crown, Clock, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    phone_number: "",
    birth_date: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { isLoggedIn, user, profile, isPremium, refreshProfile, ensureProfileExists } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      if (!isLoggedIn || !user) {
        router.push("/login")
        return
      }

      // プロフィールが存在することを確認
      if (user && !profile) {
        await ensureProfileExists(user.id)
      }

      if (profile) {
        setFormData({
          username: profile.username || "",
          full_name: profile.full_name || "",
          phone_number: profile.phone_number || "",
          birth_date: profile.birth_date || "",
        })
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [isLoggedIn, user, profile, router, ensureProfileExists])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)

    try {
      console.log("Saving profile data:", formData)

      // ユーザー名の重複チェック
      if (formData.username !== profile?.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", formData.username)
          .neq("id", user.id)
          .maybeSingle()

        if (checkError) {
          console.error("Error checking username:", checkError)
          throw new Error("ユーザー名の確認中にエラーが発生しました")
        }

        if (existingUser) {
          toast({
            title: "エラー",
            description: "このユーザー名は既に使用されています。",
            variant: "destructive",
          })
          setIsSaving(false)
          return
        }
      }

      // プロフィール更新
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          birth_date: formData.birth_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        throw error
      }

      // プロフィール情報を再取得
      await refreshProfile()

      toast({
        title: "保存完了",
        description: "プロフィール情報を更新しました。",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p>読み込み中...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">この機能を利用するにはログインが必要です。</p>
            <Button onClick={() => router.push("/login")}>ログイン</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "マイページ", href: "/account" },
              { label: "設定", href: "/account/settings" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* サイドバー */}
              <div className="w-full md:w-64">
                <Card className="mb-4">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="h-10 w-10 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{profile?.username || "ユーザー"}</CardTitle>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                      {isPremium && (
                        <Badge className="mt-2 bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          <span>プレミアム会員</span>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" />
                      アカウント情報
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      お気に入り
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/history">
                      <Clock className="mr-2 h-4 w-4" />
                      利用履歴
                    </Link>
                  </Button>
                  <Button variant="default" className="w-full justify-start" asChild>
                    <Link href="/account/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      設定
                    </Link>
                  </Button>
                </div>
              </div>

              {/* メインコンテンツ */}
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle>プロフィール設定</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">ユーザー名 *</Label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="ユーザー名を入力"
                            required
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-500 mt-1">ヘッダーやマイページに表示される名前です</p>
                        </div>

                        <div>
                          <Label htmlFor="full_name">氏名</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="氏名を入力"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone_number">電話番号</Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="09012345678"
                            className="mt-1"
                          />
                          <p className="text-sm text-gray-500 mt-1">ハイフンなしで入力してください</p>
                        </div>

                        <div>
                          <Label htmlFor="birth_date">生年月日</Label>
                          <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            min="1900-01-01"
                            max={new Date().toISOString().split("T")[0]}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>メールアドレス</Label>
                          <Input type="email" value={profile?.email || ""} disabled className="mt-1 bg-gray-50" />
                          <p className="text-sm text-gray-500 mt-1">メールアドレスは変更できません</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              保存中...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              保存する
                            </>
                          )}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                          <Link href="/account">キャンセル</Link>
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

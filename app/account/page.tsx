"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings, Heart, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isLoggedIn, user, profile, isPremium, ensureProfileExists } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedIn || !user) {
        router.push("/login")
        return
      }

      // プロフィールが存在することを確認
      if (user && !profile) {
        await ensureProfileExists(user.id)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [isLoggedIn, user, profile, router, ensureProfileExists])

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
                          <span>プレミアム会員</span>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-2">
                  <Button variant="default" className="w-full justify-start" asChild>
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
                  <Button variant="outline" className="w-full justify-start" asChild>
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
                    <CardTitle>アカウント情報</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">ユーザー名</h3>
                        <p>{profile?.username || "未設定"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">メールアドレス</h3>
                        <p>{profile?.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">氏名</h3>
                        <p>{profile?.full_name || "未設定"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">電話番号</h3>
                        <p>{profile?.phone_number || "未設定"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">生年月日</h3>
                        <p>{profile?.birth_date || "未設定"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">会員ステータス</h3>
                        <p>
                          {isPremium ? (
                            <Badge className="bg-yellow-100 text-yellow-800">プレミアム会員</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">一般会員</Badge>
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">登録日</h3>
                        <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("ja-JP") : "不明"}</p>
                      </div>

                      <div className="pt-4">
                        <Button asChild>
                          <Link href="/account/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            プロフィールを編集
                          </Link>
                        </Button>
                      </div>
                    </div>
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

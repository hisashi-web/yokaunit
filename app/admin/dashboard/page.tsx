"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import {
  Users,
  PenToolIcon as Tool,
  MessageSquare,
  Clock,
  Settings,
  AlertTriangle,
  BarChart3,
  FileText,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [lastLogin, setLastLogin] = useState("")
  const [inProgressTools, setInProgressTools] = useState([
    {
      id: 1,
      name: "MP4からMP3に変換できる無料ツール",
      description: "YouTubeの音声だけを抽出して保存したいときに便利。高品質な音声変換と簡単な操作性を実現します。",
      category: "メディア変換",
      estimatedCompletion: "来週公開予定",
    },
    {
      id: 2,
      name: "画像一括リサイズツール",
      description: "複数の画像を一度にリサイズ。SNS投稿用やWebサイト用など、用途に合わせた最適化が可能です。",
      category: "画像編集",
      estimatedCompletion: "2週間以内に公開予定",
    },
  ])
  const [editingTool, setEditingTool] = useState<any>(null)
  const [isAddingTool, setIsAddingTool] = useState(false)
  const [newTool, setNewTool] = useState({
    name: "",
    description: "",
    category: "",
    estimatedCompletion: "",
  })
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // 開発者権限の確認
    const checkAuth = () => {
      const developer = localStorage.getItem("isDeveloper") === "true"
      setIsDeveloper(developer)

      // 最終ログイン日時の取得
      const lastLoginTime = localStorage.getItem("developerLastLogin") || ""
      if (lastLoginTime) {
        const date = new Date(lastLoginTime)
        setLastLogin(
          date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        )
      }

      setIsLoading(false)

      // 開発者でない場合はホームにリダイレクト
      if (!developer) {
        router.push("/")
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [router])

  const handleEditTool = (tool: any) => {
    setEditingTool({ ...tool })
  }

  const handleUpdateTool = () => {
    if (!editingTool) return

    setInProgressTools(inProgressTools.map((tool) => (tool.id === editingTool.id ? { ...editingTool } : tool)))
    setEditingTool(null)
  }

  const handleDeleteTool = (id: number) => {
    setInProgressTools(inProgressTools.filter((tool) => tool.id !== id))
  }

  const handleAddTool = () => {
    if (!newTool.name || !newTool.description || !newTool.category || !newTool.estimatedCompletion) return

    const newId = Math.max(0, ...inProgressTools.map((t) => t.id)) + 1
    setInProgressTools([...inProgressTools, { ...newTool, id: newId }])
    setNewTool({
      name: "",
      description: "",
      category: "",
      estimatedCompletion: "",
    })
    setIsAddingTool(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>読み込み中...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isDeveloper) {
    return null // リダイレクト中
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "開発者ダッシュボード", href: "/admin/dashboard" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="dashboard" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">開発者ダッシュボード</h1>
                <p className="text-amber-700">YokaUnitの管理機能にアクセスしています。最終ログイン: {lastLogin}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2 text-amber-600" />
                      ユーザー統計
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">登録ユーザー</p>
                        <p className="text-xl font-bold text-amber-900">124</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">有料会員</p>
                        <p className="text-xl font-bold text-amber-900">28</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">本日のアクセス</p>
                        <p className="text-xl font-bold text-amber-900">342</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">新規登録（今週）</p>
                        <p className="text-xl font-bold text-amber-900">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Tool className="h-5 w-5 mr-2 text-amber-600" />
                      ツール統計
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">公開ツール数</p>
                        <p className="text-xl font-bold text-amber-900">32</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">開発中ツール</p>
                        <p className="text-xl font-bold text-amber-900">{inProgressTools.length}</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">人気ツール</p>
                        <p className="text-sm font-medium text-amber-900">パスワード生成</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">総利用回数</p>
                        <p className="text-xl font-bold text-amber-900">2,845</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                      要望・フィードバック
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">未対応の要望</p>
                        <p className="text-xl font-bold text-amber-900">8</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">選定中の要望</p>
                        <p className="text-xl font-bold text-amber-900">3</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">新規フィードバック</p>
                        <p className="text-xl font-bold text-amber-900">5</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded">
                        <p className="text-xs text-amber-700">総要望数</p>
                        <p className="text-xl font-bold text-amber-900">42</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="in-progress">
                <TabsList className="bg-amber-100 text-amber-700">
                  <TabsTrigger value="in-progress" className="data-[state=active]:bg-white">
                    開発中のツール
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="data-[state=active]:bg-white">
                    開発者メッセージ
                  </TabsTrigger>
                  <TabsTrigger value="system" className="data-[state=active]:bg-white">
                    システム状態
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="mt-4">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-amber-600" />
                        開発中のツール管理
                      </CardTitle>
                      <CardDescription>
                        現在開発中のツールを管理します。ホームページに表示される情報を更新できます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isAddingTool ? (
                        <div className="border rounded-md p-4 bg-amber-50 mb-4">
                          <h3 className="font-medium mb-3">新しいツールを追加</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">ツール名</label>
                              <Input
                                value={newTool.name}
                                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                                placeholder="ツール名を入力"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">説明</label>
                              <Textarea
                                value={newTool.description}
                                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                                placeholder="ツールの説明を入力"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">カテゴリ</label>
                              <Input
                                value={newTool.category}
                                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                                placeholder="カテゴリを入力"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">公開予定</label>
                              <Input
                                value={newTool.estimatedCompletion}
                                onChange={(e) => setNewTool({ ...newTool, estimatedCompletion: e.target.value })}
                                placeholder="例: 来週公開予定"
                                className="mt-1"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsAddingTool(false)
                                  setNewTool({
                                    name: "",
                                    description: "",
                                    category: "",
                                    estimatedCompletion: "",
                                  })
                                }}
                              >
                                キャンセル
                              </Button>
                              <Button onClick={handleAddTool}>追加</Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setIsAddingTool(true)}
                          className="mb-4 bg-amber-600 hover:bg-amber-700 flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          新しい開発中ツールを追加
                        </Button>
                      )}

                      <div className="space-y-4">
                        {inProgressTools.map((tool) => (
                          <div key={tool.id} className="border rounded-md p-4 bg-amber-50">
                            {editingTool && editingTool.id === tool.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium">ツール名</label>
                                  <Input
                                    value={editingTool.name}
                                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">説明</label>
                                  <Textarea
                                    value={editingTool.description}
                                    onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">カテゴリ</label>
                                  <Input
                                    value={editingTool.category}
                                    onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">公開予定</label>
                                  <Input
                                    value={editingTool.estimatedCompletion}
                                    onChange={(e) =>
                                      setEditingTool({ ...editingTool, estimatedCompletion: e.target.value })
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button variant="outline" onClick={() => setEditingTool(null)}>
                                    キャンセル
                                  </Button>
                                  <Button onClick={handleUpdateTool}>更新</Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium">{tool.name}</h3>
                                    <p className="text-sm text-gray-600">{tool.description}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-amber-600 border-amber-300"
                                      onClick={() => handleEditTool(tool)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-300"
                                      onClick={() => handleDeleteTool(tool.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">カテゴリ: {tool.category}</span>
                                  <span className="text-amber-700">{tool.estimatedCompletion}</span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="messages" className="mt-4">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                        開発者メッセージ管理
                      </CardTitle>
                      <CardDescription>
                        ホームページに表示される開発者からのメッセージを管理します。最新情報やお知らせを更新できます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4 bg-amber-50">
                          <h3 className="font-medium mb-2">現在のメッセージ</h3>
                          <div className="bg-white p-3 rounded border mb-4">
                            <p className="text-sm text-gray-700 mb-2">
                              今週は企業案件対応中です！来週から新しい要望の選定を再開します。
                              ポモドーロタイマーが完成しました！ぜひご利用ください。
                            </p>
                            <p className="text-sm text-gray-700">MP4→MP3変換ツールは来週完成予定です。お楽しみに！</p>
                          </div>

                          <h3 className="font-medium mb-2">メッセージを更新</h3>
                          <textarea
                            className="w-full p-3 border rounded h-32 text-sm"
                            defaultValue="今週は企業案件対応中です！来週から新しい要望の選定を再開します。
ポモドーロタイマーが完成しました！ぜひご利用ください。
MP4→MP3変換ツールは来週完成予定です。お楽しみに！"
                          ></textarea>

                          <div className="flex justify-between mt-4">
                            <Button variant="outline" className="text-amber-600 border-amber-300">
                              リセット
                            </Button>
                            <Button className="bg-amber-600 hover:bg-amber-700">メッセージを更新</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system" className="mt-4">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-amber-600" />
                        システム状態
                      </CardTitle>
                      <CardDescription>
                        サイトのシステム状態を確認し、必要に応じてメンテナンスモードを有効にできます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-md p-4 bg-green-50 border-green-200">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                              <h3 className="font-medium text-green-800">サーバー状態</h3>
                            </div>
                            <p className="text-sm text-green-700">正常に稼働中</p>
                          </div>

                          <div className="border rounded-md p-4 bg-green-50 border-green-200">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                              <h3 className="font-medium text-green-800">データベース</h3>
                            </div>
                            <p className="text-sm text-green-700">正常に接続中</p>
                          </div>

                          <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <h3 className="font-medium text-yellow-800">ストレージ使用量</h3>
                            </div>
                            <p className="text-sm text-yellow-700">75% 使用中</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 bg-amber-50">
                          <h3 className="font-medium mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                            メンテナンスモード
                          </h3>
                          <p className="text-sm text-gray-700 mb-4">
                            メンテナンスモードを有効にすると、一般ユーザーはサイトにアクセスできなくなります。
                            開発者のみがアクセス可能になります。
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer">
                                <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">現在: 無効</span>
                            </div>
                            <Button variant="outline" className="text-amber-600 border-amber-300">
                              メンテナンスモードを有効化
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button className="bg-amber-600 hover:bg-amber-700 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            詳細な統計を表示
                          </Button>
                          <Button className="bg-amber-600 hover:bg-amber-700 flex items-center justify-center">
                            <FileText className="h-4 w-4 mr-2" />
                            システムログを表示
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

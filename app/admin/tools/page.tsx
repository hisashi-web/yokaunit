"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PenToolIcon as Tool, Plus, Search, Edit, Trash2, Eye, Crown, Lock, ArrowUpDown, Filter } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminToolsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // 開発者権限の確認
    const checkAuth = () => {
      const developer = localStorage.getItem("isDeveloper") === "true"
      setIsDeveloper(developer)
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

  // ツールのサンプルデータ
  const tools = [
    {
      id: "password",
      name: "パスワード生成ツール",
      category: "セキュリティ",
      status: "公開中",
      isPremium: false,
      isPrivate: false,
      views: 1245,
      lastUpdated: "2023-12-20",
    },
    {
      id: "pomodoro",
      name: "ポモドーロタイマー",
      category: "生産性",
      status: "公開中",
      isPremium: false,
      isPrivate: false,
      views: 987,
      lastUpdated: "2023-12-15",
    },
    {
      id: "image-resize",
      name: "画像リサイズツール",
      category: "メディア",
      status: "公開中",
      isPremium: false,
      isPrivate: false,
      views: 856,
      lastUpdated: "2023-12-10",
    },
    {
      id: "image-editor-pro",
      name: "プロ仕様画像編集ツール",
      category: "メディア",
      status: "公開中",
      isPremium: true,
      isPrivate: false,
      views: 432,
      lastUpdated: "2023-12-05",
    },
    {
      id: "data-analyzer",
      name: "企業向けデータ分析ツール",
      category: "ビジネス",
      status: "公開中",
      isPremium: false,
      isPrivate: true,
      views: 128,
      lastUpdated: "2023-12-01",
    },
    {
      id: "mp4-to-mp3",
      name: "MP4からMP3に変換できる無料ツール",
      category: "メディア変換",
      status: "開発中",
      isPremium: false,
      isPrivate: false,
      views: 0,
      lastUpdated: "2023-12-22",
    },
    {
      id: "batch-image-resize",
      name: "画像一括リサイズツール",
      category: "画像編集",
      status: "開発中",
      isPremium: false,
      isPrivate: false,
      views: 0,
      lastUpdated: "2023-12-21",
    },
  ]

  // 検索とフィルタリング
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || tool.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // カテゴリーの一覧（重複なし）
  const categories = Array.from(new Set(tools.map((tool) => tool.category)))

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "開発者ダッシュボード", href: "/admin/dashboard" },
              { label: "ツール管理", href: "/admin/tools" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="tools" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">ツール管理</h1>
                <p className="text-amber-700">
                  YokaUnitのツールを管理します。新規作成、編集、公開状態の変更などが可能です。
                </p>
              </div>

              <Card className="bg-white border-amber-200 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Tool className="h-5 w-5 mr-2 text-amber-600" />
                    ツール一覧
                  </CardTitle>
                  <CardDescription>
                    すべてのツールを管理します。検索やフィルタリングで目的のツールを素早く見つけられます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="ツールを検索..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="カテゴリーで絞り込み" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべてのカテゴリー</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      新規ツール作成
                    </Button>
                  </div>

                  <Tabs defaultValue="all">
                    <TabsList className="bg-amber-100 text-amber-700 mb-4">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white">
                        すべて
                      </TabsTrigger>
                      <TabsTrigger value="published" className="data-[state=active]:bg-white">
                        公開中
                      </TabsTrigger>
                      <TabsTrigger value="in-progress" className="data-[state=active]:bg-white">
                        開発中
                      </TabsTrigger>
                      <TabsTrigger value="premium" className="data-[state=active]:bg-white">
                        プレミアム
                      </TabsTrigger>
                      <TabsTrigger value="private" className="data-[state=active]:bg-white">
                        限定公開
                      </TabsTrigger>
                    </TabsList>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-amber-50">
                            <TableHead className="w-[300px]">
                              <div className="flex items-center">
                                ツール名
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>カテゴリー</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead className="text-right">閲覧数</TableHead>
                            <TableHead>最終更新日</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTools.map((tool) => (
                            <TableRow key={tool.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {tool.name}
                                  {tool.isPremium && (
                                    <Badge className="ml-2 bg-yellow-100 text-yellow-800" title="プレミアム会員限定">
                                      <Crown className="h-3 w-3" />
                                    </Badge>
                                  )}
                                  {tool.isPrivate && (
                                    <Badge className="ml-2 bg-blue-100 text-blue-800" title="限定公開">
                                      <Lock className="h-3 w-3" />
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{tool.category}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    tool.status === "公開中"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-amber-100 text-amber-800"
                                  }
                                >
                                  {tool.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{tool.views.toLocaleString()}</TableCell>
                              <TableCell>{tool.lastUpdated}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" title="プレビュー">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="編集">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="削除">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

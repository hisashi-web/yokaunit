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
import {
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileUp,
  ImageIcon,
  PenTool,
  MessageSquare,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContentItem {
  id: string
  title: string
  type: "page" | "blog" | "tool" | "image"
  status: "published" | "draft" | "archived"
  author: string
  lastUpdated: string
  views?: number
}

export default function AdminContentPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
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

  // コンテンツのサンプルデータ
  const contentItems: ContentItem[] = [
    {
      id: "page-001",
      title: "ホームページ",
      type: "page",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-12-20",
      views: 1245,
    },
    {
      id: "page-002",
      title: "プライバシーポリシー",
      type: "page",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-11-15",
      views: 320,
    },
    {
      id: "page-003",
      title: "利用規約",
      type: "page",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-11-15",
      views: 285,
    },
    {
      id: "blog-001",
      title: "効率的なパスワード管理のコツ",
      type: "blog",
      status: "draft",
      author: "山田太郎",
      lastUpdated: "2023-12-22",
    },
    {
      id: "blog-002",
      title: "画像編集の基本テクニック",
      type: "blog",
      status: "published",
      author: "佐藤花子",
      lastUpdated: "2023-12-18",
      views: 156,
    },
    {
      id: "tool-001",
      title: "パスワード生成ツール",
      type: "tool",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-12-10",
      views: 890,
    },
    {
      id: "tool-002",
      title: "画像リサイズツール",
      type: "tool",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-12-05",
      views: 720,
    },
    {
      id: "tool-003",
      title: "MP4からMP3への変換ツール",
      type: "tool",
      status: "draft",
      author: "開発者",
      lastUpdated: "2023-12-23",
    },
    {
      id: "image-001",
      title: "ヒーローイメージ",
      type: "image",
      status: "published",
      author: "開発者",
      lastUpdated: "2023-12-15",
    },
    {
      id: "image-002",
      title: "ブログヘッダー",
      type: "image",
      status: "published",
      author: "佐藤花子",
      lastUpdated: "2023-12-18",
    },
  ]

  // フィルタリング
  const getFilteredContent = () => {
    let filtered = [...contentItems]

    // タイプによるフィルタリング
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const filteredContent = getFilteredContent()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">公開中</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">下書き</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">アーカイブ</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "page":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "blog":
        return <PenTool className="h-4 w-4 text-purple-500" />
      case "tool":
        return <PenTool className="h-4 w-4 text-amber-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "page":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>ページ</span>
          </Badge>
        )
      case "blog":
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <PenTool className="h-3 w-3" />
            <span>ブログ</span>
          </Badge>
        )
      case "tool":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <PenTool className="h-3 w-3" />
            <span>ツール</span>
          </Badge>
        )
      case "image":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            <span>画像</span>
          </Badge>
        )
      default:
        return <Badge>{type}</Badge>
    }
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
              { label: "コンテンツ管理", href: "/admin/content" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="content" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">コンテンツ管理</h1>
                <p className="text-amber-700">
                  YokaUnitのコンテンツを管理します。ページ、ブログ記事、ツール、画像などの追加、編集、削除が可能です。
                </p>
              </div>

              <Card className="bg-white border-amber-200 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-600" />
                    コンテンツ一覧
                  </CardTitle>
                  <CardDescription>
                    すべてのコンテンツを管理します。検索やフィルタリングで目的のコンテンツを素早く見つけられます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="コンテンツを検索..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="タイプで絞り込み" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべてのタイプ</SelectItem>
                          <SelectItem value="page">ページ</SelectItem>
                          <SelectItem value="blog">ブログ</SelectItem>
                          <SelectItem value="tool">ツール</SelectItem>
                          <SelectItem value="image">画像</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ステータスで絞り込み" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべてのステータス</SelectItem>
                          <SelectItem value="published">公開中</SelectItem>
                          <SelectItem value="draft">下書き</SelectItem>
                          <SelectItem value="archived">アーカイブ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      新規コンテンツ
                    </Button>
                  </div>

                  <Tabs defaultValue="all-content">
                    <TabsList className="bg-amber-100 text-amber-700 mb-4">
                      <TabsTrigger value="all-content" className="data-[state=active]:bg-white">
                        すべて
                      </TabsTrigger>
                      <TabsTrigger value="pages" className="data-[state=active]:bg-white">
                        ページ
                      </TabsTrigger>
                      <TabsTrigger value="blogs" className="data-[state=active]:bg-white">
                        ブログ
                      </TabsTrigger>
                      <TabsTrigger value="tools" className="data-[state=active]:bg-white">
                        ツール
                      </TabsTrigger>
                      <TabsTrigger value="images" className="data-[state=active]:bg-white">
                        画像
                      </TabsTrigger>
                    </TabsList>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-amber-50">
                            <TableHead className="w-[300px]">
                              <div className="flex items-center">
                                タイトル
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>タイプ</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>作成者</TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                最終更新日
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredContent.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(item.type)}
                                  <span className="font-medium">{item.title}</span>
                                </div>
                              </TableCell>
                              <TableCell>{getTypeBadge(item.type)}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{item.author}</TableCell>
                              <TableCell>{item.lastUpdated}</TableCell>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileUp className="h-5 w-5 mr-2 text-amber-600" />
                      クイックアップロード
                    </CardTitle>
                    <CardDescription>新しいコンテンツをすばやくアップロードします。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file-upload">ファイルをアップロード</Label>
                        <Input id="file-upload" type="file" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">タイトル</Label>
                        <Input id="title" placeholder="コンテンツのタイトル" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">説明</Label>
                        <Textarea id="description" placeholder="コンテンツの説明" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content-type">コンテンツタイプ</Label>
                        <Select>
                          <SelectTrigger id="content-type">
                            <SelectValue placeholder="タイプを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="page">ページ</SelectItem>
                            <SelectItem value="blog">ブログ</SelectItem>
                            <SelectItem value="tool">ツール</SelectItem>
                            <SelectItem value="image">画像</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">アップロード</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                      最近のコメント
                    </CardTitle>
                    <CardDescription>コンテンツに対する最近のコメントを確認します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">山田太郎</span>
                          <span className="text-xs text-gray-500">2023-12-23</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          パスワード生成ツールがとても便利です。強度チェック機能も役立っています。
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">パスワード生成ツール</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            返信
                          </Button>
                        </div>
                      </div>

                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">佐藤花子</span>
                          <span className="text-xs text-gray-500">2023-12-22</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          画像リサイズツールの使い方についてもう少し詳しい説明があると助かります。
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">画像リサイズツール</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            返信
                          </Button>
                        </div>
                      </div>

                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">鈴木一郎</span>
                          <span className="text-xs text-gray-500">2023-12-21</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          ブログ記事「効率的なパスワード管理のコツ」が非常に参考になりました。
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">効率的なパスワード管理のコツ</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            返信
                          </Button>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        すべてのコメントを見る
                      </Button>
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

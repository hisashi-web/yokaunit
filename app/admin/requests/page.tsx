"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MessageSquare, Search, Filter, ArrowUpDown, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminRequestsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
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

  // 要望のサンプルデータ
  const toolRequests = [
    {
      id: "req-001",
      title: "MP4からMP3に変換できる無料ツール",
      description: "YouTubeの音声だけを抽出して保存したいです。シンプルで使いやすいUIが希望です。",
      status: "作成中",
      category: "メディア変換",
      votes: 124,
      comments: 18,
      date: "2023-12-15",
      user: "user123",
    },
    {
      id: "req-002",
      title: "プログラミング学習進捗管理アプリ",
      description: "学習時間や完了したコースを記録できるダッシュボード形式のアプリが欲しいです。",
      status: "選定中",
      category: "教育",
      votes: 98,
      comments: 12,
      date: "2023-12-18",
      user: "coder456",
    },
    {
      id: "req-003",
      title: "シンプルなポモドーロタイマー",
      description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付きだと嬉しいです。",
      status: "完了",
      category: "生産性",
      votes: 87,
      comments: 9,
      date: "2023-12-10",
      user: "focusmaster",
    },
    {
      id: "req-004",
      title: "レシピ検索＆栄養素計算ツール",
      description: "材料から検索でき、完成した料理の栄養素も計算できるツールが欲しいです。",
      status: "選定中",
      category: "健康",
      votes: 76,
      comments: 14,
      date: "2023-12-20",
      user: "healthyfood",
    },
    {
      id: "req-005",
      title: "PDFを画像に変換するツール",
      description: "PDFの各ページをJPGやPNG形式で保存できるシンプルなツールが欲しいです。",
      status: "選定中",
      category: "ファイル変換",
      votes: 65,
      comments: 7,
      date: "2023-12-22",
      user: "converter789",
    },
  ]

  // お問い合わせのサンプルデータ
  const contactRequests = [
    {
      id: "contact-001",
      name: "山田太郎",
      email: "yamada@example.com",
      subject: "パスワード生成ツールについて",
      message: "パスワード生成ツールで複数のパスワードを一度に生成する機能はありますか？",
      status: "未対応",
      date: "2023-12-23",
      type: "一般的なお問い合わせ",
    },
    {
      id: "contact-002",
      name: "佐藤花子",
      email: "sato@example.com",
      subject: "有料会員プランについて",
      message: "有料会員プランの支払い方法について教えてください。クレジットカード以外の方法はありますか？",
      status: "対応中",
      date: "2023-12-22",
      type: "有料会員について",
    },
    {
      id: "contact-003",
      name: "鈴木一郎",
      email: "suzuki@example.com",
      subject: "ツールのバグ報告",
      message: "マークダウンエディタで日本語入力時に予測変換が正しく表示されない問題があります。",
      status: "完了",
      date: "2023-12-20",
      type: "不具合の報告",
    },
    {
      id: "contact-004",
      name: "田中健太",
      email: "tanaka@company.co.jp",
      subject: "企業向けカスタマイズについて",
      message: "弊社向けにカスタマイズしたツールの開発は可能でしょうか？詳細について相談したいです。",
      status: "対応中",
      date: "2023-12-21",
      type: "企業向けサービスについて",
    },
    {
      id: "contact-005",
      name: "伊藤めぐみ",
      email: "ito@example.com",
      subject: "新機能のリクエスト",
      message: "カレンダーと連携できるタスク管理ツールがあると便利だと思います。ご検討いただけますか？",
      status: "未対応",
      date: "2023-12-23",
      type: "ツールのリクエスト",
    },
  ]

  // 企業からのお問い合わせのサンプルデータ
  const corporateRequests = [
    {
      id: "corp-001",
      companyName: "株式会社テクノソリューション",
      contactName: "鈴木部長",
      email: "suzuki@techno-solution.co.jp",
      phone: "03-1234-5678",
      inquiry: "社内向けデータ分析ツールのカスタマイズについて相談したいです。予算は100万円程度で考えています。",
      status: "未対応",
      date: "2023-12-23",
      budget: "50万円~100万円",
    },
    {
      id: "corp-002",
      companyName: "グローバルマーケティング株式会社",
      contactName: "佐藤マネージャー",
      email: "sato@global-marketing.co.jp",
      phone: "03-8765-4321",
      inquiry:
        "マーケティングデータの可視化ツールを開発いただきたいです。既存のツールをベースにカスタマイズできますか？",
      status: "対応中",
      date: "2023-12-21",
      budget: "100万円~300万円",
    },
    {
      id: "corp-003",
      companyName: "メディカルケアシステムズ",
      contactName: "田中ディレクター",
      email: "tanaka@medical-care.co.jp",
      phone: "03-2345-6789",
      inquiry: "医療データの安全な管理と分析ができるツールを探しています。NDAを締結した上で詳細を相談したいです。",
      status: "完了",
      date: "2023-12-18",
      budget: "300万円~",
    },
  ]

  // フィルタリング
  const getFilteredToolRequests = () => {
    let filtered = [...toolRequests]

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.category.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const getFilteredContactRequests = () => {
    let filtered = [...contactRequests]

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(query) ||
          request.subject.toLowerCase().includes(query) ||
          request.message.toLowerCase().includes(query) ||
          request.type.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const getFilteredCorporateRequests = () => {
    let filtered = [...corporateRequests]

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.companyName.toLowerCase().includes(query) ||
          request.contactName.toLowerCase().includes(query) ||
          request.inquiry.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const filteredToolRequests = getFilteredToolRequests()
  const filteredContactRequests = getFilteredContactRequests()
  const filteredCorporateRequests = getFilteredCorporateRequests()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "未対応":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>未対応</span>
          </Badge>
        )
      case "対応中":
      case "選定中":
      case "作成中":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        )
      case "完了":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>完了</span>
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
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
              { label: "要望管理", href: "/admin/requests" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="requests" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">要望管理</h1>
                <p className="text-amber-700">ユーザーからの要望、お問い合わせ、企業からの問い合わせを管理します。</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="検索..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="ステータスで絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのステータス</SelectItem>
                      <SelectItem value="未対応">未対応</SelectItem>
                      <SelectItem value="対応中">対応中</SelectItem>
                      <SelectItem value="選定中">選定中</SelectItem>
                      <SelectItem value="作成中">作成中</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="tool-requests">
                <TabsList className="bg-amber-100 text-amber-700 mb-4">
                  <TabsTrigger value="tool-requests" className="data-[state=active]:bg-white">
                    ツール要望
                  </TabsTrigger>
                  <TabsTrigger value="contact-requests" className="data-[state=active]:bg-white">
                    お問い合わせ
                  </TabsTrigger>
                  <TabsTrigger value="corporate-requests" className="data-[state=active]:bg-white">
                    企業からの問い合わせ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tool-requests">
                  <Card className="bg-white border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                        ツール要望一覧
                      </CardTitle>
                      <CardDescription>
                        ユーザーから投稿されたツール要望を管理します。ステータスの更新や詳細の確認ができます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-amber-50">
                              <TableHead className="w-[300px]">
                                <div className="flex items-center">
                                  要望タイトル
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                              </TableHead>
                              <TableHead>カテゴリー</TableHead>
                              <TableHead>ステータス</TableHead>
                              <TableHead className="text-right">投票数</TableHead>
                              <TableHead>投稿日</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredToolRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">{request.title}</div>
                                </TableCell>
                                <TableCell>{request.category}</TableCell>
                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                <TableCell className="text-right">{request.votes}</TableCell>
                                <TableCell>{request.date}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" title="詳細を見る">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="承認">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="却下">
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact-requests">
                  <Card className="bg-white border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                        お問い合わせ一覧
                      </CardTitle>
                      <CardDescription>
                        ユーザーからのお問い合わせを管理します。対応状況の更新や詳細の確認ができます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-amber-50">
                              <TableHead>
                                <div className="flex items-center">
                                  名前
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                              </TableHead>
                              <TableHead className="w-[300px]">件名</TableHead>
                              <TableHead>種類</TableHead>
                              <TableHead>ステータス</TableHead>
                              <TableHead>日付</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredContactRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.name}</TableCell>
                                <TableCell>{request.subject}</TableCell>
                                <TableCell>{request.type}</TableCell>
                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                <TableCell>{request.date}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" title="詳細を見る">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="対応済みにする">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="corporate-requests">
                  <Card className="bg-white border-amber-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-amber-600" />
                        企業からの問い合わせ一覧
                      </CardTitle>
                      <CardDescription>
                        企業からの問い合わせを管理します。対応状況の更新や詳細の確認ができます。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-amber-50">
                              <TableHead className="w-[200px]">
                                <div className="flex items-center">
                                  会社名
                                  <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                              </TableHead>
                              <TableHead>担当者</TableHead>
                              <TableHead>予算</TableHead>
                              <TableHead>ステータス</TableHead>
                              <TableHead>日付</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCorporateRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.companyName}</TableCell>
                                <TableCell>{request.contactName}</TableCell>
                                <TableCell>{request.budget}</TableCell>
                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                <TableCell>{request.date}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" title="詳細を見る">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="対応済みにする">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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

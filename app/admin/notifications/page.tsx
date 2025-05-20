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
import { Bell, Search, Filter, ArrowUpDown, Eye, Edit, Trash2, Plus, Send, Users, Mail, BellRing } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Notification {
  id: string
  title: string
  content: string
  type: "system" | "update" | "alert" | "marketing"
  status: "draft" | "scheduled" | "sent"
  audience: "all" | "premium" | "free" | "inactive"
  scheduledDate?: string
  sentDate?: string
  recipients?: number
  openRate?: number
}

export default function AdminNotificationsPage() {
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

  // 通知のサンプルデータ
  const notifications: Notification[] = [
    {
      id: "notif-001",
      title: "新機能のお知らせ",
      content: "新しいツール「MP4からMP3への変換ツール」がリリースされました。ぜひご利用ください。",
      type: "update",
      status: "sent",
      audience: "all",
      sentDate: "2023-12-20",
      recipients: 1245,
      openRate: 68.5,
    },
    {
      id: "notif-002",
      title: "メンテナンスのお知らせ",
      content: "2023年12月25日 午前2時から4時まで、システムメンテナンスのためサービスを一時停止します。",
      type: "alert",
      status: "scheduled",
      audience: "all",
      scheduledDate: "2023-12-24",
    },
    {
      id: "notif-003",
      title: "プレミアム会員限定機能のご案内",
      content: "プレミアム会員向けに新しい高度な画像編集ツールをリリースしました。",
      type: "marketing",
      status: "sent",
      audience: "premium",
      sentDate: "2023-12-18",
      recipients: 28,
      openRate: 85.7,
    },
    {
      id: "notif-004",
      title: "アカウント確認のお願い",
      content: "長期間ログインがありません。アカウントの確認をお願いします。",
      type: "system",
      status: "draft",
      audience: "inactive",
    },
    {
      id: "notif-005",
      title: "年末年始の営業について",
      content: "年末年始（12/29〜1/3）はサポート対応をお休みさせていただきます。",
      type: "system",
      status: "scheduled",
      audience: "all",
      scheduledDate: "2023-12-28",
    },
    {
      id: "notif-006",
      title: "プライバシーポリシー改定のお知らせ",
      content: "2024年1月1日よりプライバシーポリシーを改定します。詳細はお知らせをご確認ください。",
      type: "alert",
      status: "draft",
      audience: "all",
    },
    {
      id: "notif-007",
      title: "無料トライアル終了のお知らせ",
      content:
        "プレミアム機能の無料トライアル期間が終了します。引き続きご利用いただくには有料プランへのアップグレードが必要です。",
      type: "marketing",
      status: "sent",
      audience: "free",
      sentDate: "2023-12-15",
      recipients: 96,
      openRate: 72.9,
    },
  ]

  // フィルタリング
  const getFilteredNotifications = () => {
    let filtered = [...notifications]

    // タイプによるフィルタリング
    if (typeFilter !== "all") {
      filtered = filtered.filter((notification) => notification.type === typeFilter)
    }

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((notification) => notification.status === statusFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.content.toLowerCase().includes(query) ||
          notification.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const filteredNotifications = getFilteredNotifications()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">下書き</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">予約済み</Badge>
      case "sent":
        return <Badge className="bg-green-100 text-green-800">送信済み</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "system":
        return <Badge className="bg-purple-100 text-purple-800">システム</Badge>
      case "update":
        return <Badge className="bg-blue-100 text-blue-800">アップデート</Badge>
      case "alert":
        return <Badge className="bg-red-100 text-red-800">アラート</Badge>
      case "marketing":
        return <Badge className="bg-green-100 text-green-800">マーケティング</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "all":
        return <Badge className="bg-gray-100 text-gray-800">全ユーザー</Badge>
      case "premium":
        return <Badge className="bg-yellow-100 text-yellow-800">プレミアム会員</Badge>
      case "free":
        return <Badge className="bg-blue-100 text-blue-800">無料ユーザー</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">非アクティブユーザー</Badge>
      default:
        return <Badge>{audience}</Badge>
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
              { label: "通知管理", href: "/admin/notifications" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="notifications" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">通知管理</h1>
                <p className="text-amber-700">
                  YokaUnitのユーザーへの通知を管理します。システム通知、アップデート情報、アラートなどの作成、編集、送信が可能です。
                </p>
              </div>

              <Card className="bg-white border-amber-200 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-amber-600" />
                    通知一覧
                  </CardTitle>
                  <CardDescription>
                    すべての通知を管理します。検索やフィルタリングで目的の通知を素早く見つけられます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="通知を検索..."
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
                          <SelectItem value="system">システム</SelectItem>
                          <SelectItem value="update">アップデート</SelectItem>
                          <SelectItem value="alert">アラート</SelectItem>
                          <SelectItem value="marketing">マーケティング</SelectItem>
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
                          <SelectItem value="draft">下書き</SelectItem>
                          <SelectItem value="scheduled">予約済み</SelectItem>
                          <SelectItem value="sent">送信済み</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />
                      新規通知作成
                    </Button>
                  </div>

                  <Tabs defaultValue="all-notifications">
                    <TabsList className="bg-amber-100 text-amber-700 mb-4">
                      <TabsTrigger value="all-notifications" className="data-[state=active]:bg-white">
                        すべて
                      </TabsTrigger>
                      <TabsTrigger value="drafts" className="data-[state=active]:bg-white">
                        下書き
                      </TabsTrigger>
                      <TabsTrigger value="scheduled" className="data-[state=active]:bg-white">
                        予約済み
                      </TabsTrigger>
                      <TabsTrigger value="sent" className="data-[state=active]:bg-white">
                        送信済み
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
                            <TableHead>対象者</TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                日付
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredNotifications.map((notification) => (
                            <TableRow key={notification.id}>
                              <TableCell>
                                <div className="font-medium">{notification.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-[300px]">
                                  {notification.content}
                                </div>
                              </TableCell>
                              <TableCell>{getTypeBadge(notification.type)}</TableCell>
                              <TableCell>{getStatusBadge(notification.status)}</TableCell>
                              <TableCell>{getAudienceBadge(notification.audience)}</TableCell>
                              <TableCell>
                                {notification.status === "sent"
                                  ? notification.sentDate
                                  : notification.status === "scheduled"
                                    ? notification.scheduledDate
                                    : "-"}
                              </TableCell>
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
                      <Send className="h-5 w-5 mr-2 text-amber-600" />
                      クイック通知
                    </CardTitle>
                    <CardDescription>素早く通知を作成して送信します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notification-title">タイトル</Label>
                        <Input id="notification-title" placeholder="通知のタイトル" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notification-content">内容</Label>
                        <Textarea id="notification-content" placeholder="通知の内容" className="min-h-[100px]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="notification-type">タイプ</Label>
                          <Select>
                            <SelectTrigger id="notification-type">
                              <SelectValue placeholder="タイプを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="system">システム</SelectItem>
                              <SelectItem value="update">アップデート</SelectItem>
                              <SelectItem value="alert">アラート</SelectItem>
                              <SelectItem value="marketing">マーケティング</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notification-audience">対象者</Label>
                          <Select>
                            <SelectTrigger id="notification-audience">
                              <SelectValue placeholder="対象者を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">全ユーザー</SelectItem>
                              <SelectItem value="premium">プレミアム会員</SelectItem>
                              <SelectItem value="free">無料ユーザー</SelectItem>
                              <SelectItem value="inactive">非アクティブユーザー</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="schedule-notification" />
                        <Label htmlFor="schedule-notification">送信を予約する</Label>
                      </div>
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">送信</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BellRing className="h-5 w-5 mr-2 text-amber-600" />
                      通知統計
                    </CardTitle>
                    <CardDescription>通知の効果を分析します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-amber-50 p-4 rounded-md text-center">
                          <Mail className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                          <h4 className="text-sm font-medium">送信済み通知</h4>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md text-center">
                          <Users className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                          <h4 className="text-sm font-medium">総受信者数</h4>
                          <p className="text-2xl font-bold">1,245</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md text-center">
                          <Eye className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                          <h4 className="text-sm font-medium">平均開封率</h4>
                          <p className="text-2xl font-bold">68.5%</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-3">最近の通知パフォーマンス</h3>
                        <div className="space-y-3">
                          <div className="border-b pb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">新機能のお知らせ</span>
                              <span className="text-sm">68.5%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "68.5%" }}></div>
                            </div>
                          </div>
                          <div className="border-b pb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">プレミアム会員限定機能のご案内</span>
                              <span className="text-sm">85.7%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85.7%" }}></div>
                            </div>
                          </div>
                          <div className="border-b pb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">無料トライアル終了のお知らせ</span>
                              <span className="text-sm">72.9%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "72.9%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        詳細な統計を見る
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white border-amber-200 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    最近の通知受信者
                  </CardTitle>
                  <CardDescription>最近通知を受信したユーザー</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="山田太郎" />
                          <AvatarFallback>山田</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">山田太郎</div>
                          <div className="text-sm text-gray-500">yamada@example.com</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">新機能のお知らせ</div>
                        <div className="text-xs text-gray-500">2023-12-20 開封済み</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="佐藤花子" />
                          <AvatarFallback>佐藤</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">佐藤花子</div>
                          <div className="text-sm text-gray-500">sato@example.com</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">新機能のお知らせ</div>
                        <div className="text-xs text-gray-500">2023-12-20 未開封</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="田中健太" />
                          <AvatarFallback>田中</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">田中健太</div>
                          <div className="text-sm text-gray-500">tanaka@example.com</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">プレミアム会員限定機能のご案内</div>
                        <div className="text-xs text-gray-500">2023-12-18 開封済み</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="鈴木一郎" />
                          <AvatarFallback>鈴木</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">鈴木一郎</div>
                          <div className="text-sm text-gray-500">suzuki@example.com</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">無料トライアル終了のお知らせ</div>
                        <div className="text-xs text-gray-500">2023-12-15 開封済み</div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      すべての受信者を見る
                    </Button>
                  </div>
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

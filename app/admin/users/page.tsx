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
import { Users, Search, Filter, ArrowUpDown, Eye, UserPlus, UserMinus, Crown, Mail, Calendar } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "banned"
  role: "user" | "premium" | "admin"
  joinDate: string
  lastLogin: string
  avatar?: string
}

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
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

  // ユーザーのサンプルデータ
  const users: User[] = [
    {
      id: "user-001",
      name: "山田太郎",
      email: "yamada@example.com",
      status: "active",
      role: "premium",
      joinDate: "2023-10-15",
      lastLogin: "2023-12-23",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-002",
      name: "佐藤花子",
      email: "sato@example.com",
      status: "active",
      role: "user",
      joinDate: "2023-11-05",
      lastLogin: "2023-12-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-003",
      name: "鈴木一郎",
      email: "suzuki@example.com",
      status: "inactive",
      role: "user",
      joinDate: "2023-09-22",
      lastLogin: "2023-11-30",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-004",
      name: "田中健太",
      email: "tanaka@example.com",
      status: "active",
      role: "premium",
      joinDate: "2023-08-10",
      lastLogin: "2023-12-22",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-005",
      name: "伊藤めぐみ",
      email: "ito@example.com",
      status: "banned",
      role: "user",
      joinDate: "2023-07-15",
      lastLogin: "2023-10-05",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-006",
      name: "渡辺健",
      email: "watanabe@example.com",
      status: "active",
      role: "admin",
      joinDate: "2023-06-01",
      lastLogin: "2023-12-23",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-007",
      name: "小林さくら",
      email: "kobayashi@example.com",
      status: "active",
      role: "premium",
      joinDate: "2023-11-20",
      lastLogin: "2023-12-21",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-008",
      name: "加藤雄太",
      email: "kato@example.com",
      status: "inactive",
      role: "user",
      joinDate: "2023-10-10",
      lastLogin: "2023-11-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // フィルタリング
  const getFilteredUsers = () => {
    let filtered = [...users]

    // ステータスによるフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // ロールによるフィルタリング
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const filteredUsers = getFilteredUsers()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">アクティブ</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">非アクティブ</Badge>
      case "banned":
        return <Badge className="bg-red-100 text-red-800">停止中</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Crown className="h-3 w-3" />
            <span>管理者</span>
          </Badge>
        )
      case "premium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Crown className="h-3 w-3" />
            <span>プレミアム</span>
          </Badge>
        )
      case "user":
        return <Badge className="bg-blue-100 text-blue-800">一般ユーザー</Badge>
      default:
        return <Badge>{role}</Badge>
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
              { label: "ユーザー管理", href: "/admin/users" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="users" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">ユーザー管理</h1>
                <p className="text-amber-700">
                  YokaUnitのユーザーを管理します。ユーザーの追加、編集、ステータス変更などが可能です。
                </p>
              </div>

              <Card className="bg-white border-amber-200 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    ユーザー一覧
                  </CardTitle>
                  <CardDescription>
                    登録ユーザーを管理します。検索やフィルタリングで目的のユーザーを素早く見つけられます。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="ユーザーを検索..."
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
                          <SelectItem value="active">アクティブ</SelectItem>
                          <SelectItem value="inactive">非アクティブ</SelectItem>
                          <SelectItem value="banned">停止中</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ロールで絞り込み" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべてのロール</SelectItem>
                          <SelectItem value="admin">管理者</SelectItem>
                          <SelectItem value="premium">プレミアム</SelectItem>
                          <SelectItem value="user">一般ユーザー</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      新規ユーザー追加
                    </Button>
                  </div>

                  <Tabs defaultValue="all-users">
                    <TabsList className="bg-amber-100 text-amber-700 mb-4">
                      <TabsTrigger value="all-users" className="data-[state=active]:bg-white">
                        すべてのユーザー
                      </TabsTrigger>
                      <TabsTrigger value="premium-users" className="data-[state=active]:bg-white">
                        プレミアム会員
                      </TabsTrigger>
                      <TabsTrigger value="inactive-users" className="data-[state=active]:bg-white">
                        非アクティブユーザー
                      </TabsTrigger>
                    </TabsList>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-amber-50">
                            <TableHead className="w-[250px]">
                              <div className="flex items-center">
                                ユーザー
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>ロール</TableHead>
                            <TableHead>
                              <div className="flex items-center">
                                登録日
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </div>
                            </TableHead>
                            <TableHead>最終ログイン</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                  {user.joinDate}
                                </div>
                              </TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" title="詳細を見る">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="メール送信">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="アカウント停止">
                                    <UserMinus className="h-4 w-4" />
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
                      <Crown className="h-5 w-5 mr-2 text-amber-600" />
                      プレミアム設定
                    </CardTitle>
                    <CardDescription>プレミアム会員の設定を管理します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="premium-trial">無料トライアル期間</Label>
                          <p className="text-sm text-gray-500">新規ユーザーに7日間の無料トライアルを提供</p>
                        </div>
                        <Switch id="premium-trial" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="premium-auto-renew">自動更新</Label>
                          <p className="text-sm text-gray-500">プレミアム会員の自動更新を有効にする</p>
                        </div>
                        <Switch id="premium-auto-renew" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="premium-discount">年間プラン割引</Label>
                          <p className="text-sm text-gray-500">年間プランに20%の割引を適用</p>
                        </div>
                        <Switch id="premium-discount" defaultChecked />
                      </div>
                      <div className="pt-4">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">設定を保存</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-amber-600" />
                      メール通知設定
                    </CardTitle>
                    <CardDescription>ユーザーへのメール通知設定を管理します。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="welcome-email">ウェルカムメール</Label>
                          <p className="text-sm text-gray-500">新規登録ユーザーへのウェルカムメール</p>
                        </div>
                        <Switch id="welcome-email" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="premium-notification">プレミアム通知</Label>
                          <p className="text-sm text-gray-500">プレミアム会員の期限が近づいたときの通知</p>
                        </div>
                        <Switch id="premium-notification" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="newsletter">ニュースレター</Label>
                          <p className="text-sm text-gray-500">週間ニュースレターの配信</p>
                        </div>
                        <Switch id="newsletter" />
                      </div>
                      <div className="pt-4">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">設定を保存</Button>
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

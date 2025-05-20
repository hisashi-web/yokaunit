"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Calendar,
  Download,
  ArrowUpRight,
  MousePointerClick,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [period, setPeriod] = useState("7days")
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

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "開発者ダッシュボード", href: "/admin/dashboard" },
              { label: "アクセス解析", href: "/admin/analytics" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="analytics" />

            <div className="flex-1">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-amber-800 mb-2">アクセス解析</h1>
                    <p className="text-amber-700">
                      YokaUnitのアクセス統計を確認します。訪問者数、ページビュー、人気ツールなどの分析が可能です。
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="期間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">今日</SelectItem>
                        <SelectItem value="yesterday">昨日</SelectItem>
                        <SelectItem value="7days">過去7日間</SelectItem>
                        <SelectItem value="30days">過去30日間</SelectItem>
                        <SelectItem value="90days">過去90日間</SelectItem>
                        <SelectItem value="year">過去1年</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span>レポート</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">訪問者数</p>
                        <h3 className="text-2xl font-bold mt-1">12,543</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>12.5% 増加</span>
                        </p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">ページビュー</p>
                        <h3 className="text-2xl font-bold mt-1">45,872</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>8.3% 増加</span>
                        </p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <MousePointerClick className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">平均滞在時間</p>
                        <h3 className="text-2xl font-bold mt-1">3分42秒</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>5.2% 増加</span>
                        </p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">直帰率</p>
                        <h3 className="text-2xl font-bold mt-1">32.4%</h3>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>2.1% 改善</span>
                        </p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="mb-6">
                <TabsList className="bg-amber-100 text-amber-700 mb-4">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                    概要
                  </TabsTrigger>
                  <TabsTrigger value="traffic" className="data-[state=active]:bg-white">
                    トラフィック
                  </TabsTrigger>
                  <TabsTrigger value="content" className="data-[state=active]:bg-white">
                    コンテンツ
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-white">
                    ユーザー
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                          訪問者数の推移
                        </CardTitle>
                        <CardDescription>過去7日間の訪問者数の推移</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                          <p className="text-amber-600">グラフ表示エリア</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-amber-600" />
                          地域別訪問者
                        </CardTitle>
                        <CardDescription>訪問者の地域分布</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                          <p className="text-amber-600">地図表示エリア</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="traffic">
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                          トラフィックソース
                        </CardTitle>
                        <CardDescription>訪問者の流入元</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                            <p className="text-amber-600">円グラフ表示エリア</p>
                          </div>
                          <div className="space-y-4">
                            <div className="border-b pb-2">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">Google</span>
                                <span>45.2%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "45.2%" }}></div>
                              </div>
                            </div>
                            <div className="border-b pb-2">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">直接アクセス</span>
                                <span>25.8%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "25.8%" }}></div>
                              </div>
                            </div>
                            <div className="border-b pb-2">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">Twitter</span>
                                <span>12.4%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "12.4%" }}></div>
                              </div>
                            </div>
                            <div className="border-b pb-2">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">Instagram</span>
                                <span>8.7%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "8.7%" }}></div>
                              </div>
                            </div>
                            <div className="border-b pb-2">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium">その他</span>
                                <span>7.9%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "7.9%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-amber-600" />
                          検索キーワード
                        </CardTitle>
                        <CardDescription>ユーザーが使用した検索キーワード</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-medium">キーワード</th>
                                <th className="text-right py-2 font-medium">セッション</th>
                                <th className="text-right py-2 font-medium">ユーザー</th>
                                <th className="text-right py-2 font-medium">直帰率</th>
                                <th className="text-right py-2 font-medium">平均セッション時間</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2">パスワード 生成 無料</td>
                                <td className="text-right py-2">1,245</td>
                                <td className="text-right py-2">1,120</td>
                                <td className="text-right py-2">28.4%</td>
                                <td className="text-right py-2">2:45</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">画像 リサイズ オンライン</td>
                                <td className="text-right py-2">987</td>
                                <td className="text-right py-2">876</td>
                                <td className="text-right py-2">32.1%</td>
                                <td className="text-right py-2">3:12</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">PDF 画像 変換</td>
                                <td className="text-right py-2">856</td>
                                <td className="text-right py-2">742</td>
                                <td className="text-right py-2">29.8%</td>
                                <td className="text-right py-2">2:58</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">ポモドーロ タイマー</td>
                                <td className="text-right py-2">723</td>
                                <td className="text-right py-2">654</td>
                                <td className="text-right py-2">25.6%</td>
                                <td className="text-right py-2">4:21</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">マークダウン エディタ</td>
                                <td className="text-right py-2">612</td>
                                <td className="text-right py-2">543</td>
                                <td className="text-right py-2">31.2%</td>
                                <td className="text-right py-2">3:05</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="content">
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                          人気ページ
                        </CardTitle>
                        <CardDescription>最もアクセスの多いページ</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-medium">ページ</th>
                                <th className="text-right py-2 font-medium">ページビュー</th>
                                <th className="text-right py-2 font-medium">ユニークビュー</th>
                                <th className="text-right py-2 font-medium">平均滞在時間</th>
                                <th className="text-right py-2 font-medium">直帰率</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2">/tools/password</td>
                                <td className="text-right py-2">5,432</td>
                                <td className="text-right py-2">4,321</td>
                                <td className="text-right py-2">4:12</td>
                                <td className="text-right py-2">25.4%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">/tools/image-resize</td>
                                <td className="text-right py-2">4,321</td>
                                <td className="text-right py-2">3,456</td>
                                <td className="text-right py-2">3:45</td>
                                <td className="text-right py-2">28.7%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">/tools/pdf-to-image</td>
                                <td className="text-right py-2">3,654</td>
                                <td className="text-right py-2">2,987</td>
                                <td className="text-right py-2">3:21</td>
                                <td className="text-right py-2">30.2%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">/tools/pomodoro</td>
                                <td className="text-right py-2">2,987</td>
                                <td className="text-right py-2">2,543</td>
                                <td className="text-right py-2">5:32</td>
                                <td className="text-right py-2">22.1%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">/tools/markdown</td>
                                <td className="text-right py-2">2,543</td>
                                <td className="text-right py-2">2,123</td>
                                <td className="text-right py-2">4:15</td>
                                <td className="text-right py-2">26.8%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                          コンテンツパフォーマンス
                        </CardTitle>
                        <CardDescription>コンテンツタイプ別のパフォーマンス</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                          <p className="text-amber-600">グラフ表示エリア</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2 text-amber-600" />
                          ユーザー属性
                        </CardTitle>
                        <CardDescription>訪問者の年齢・性別分布</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                          <p className="text-amber-600">グラフ表示エリア</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-amber-600" />
                          地域分布
                        </CardTitle>
                        <CardDescription>訪問者の地域分布</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-medium">国/地域</th>
                                <th className="text-right py-2 font-medium">ユーザー</th>
                                <th className="text-right py-2 font-medium">セッション</th>
                                <th className="text-right py-2 font-medium">直帰率</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="py-2">日本</td>
                                <td className="text-right py-2">10,543</td>
                                <td className="text-right py-2">15,432</td>
                                <td className="text-right py-2">32.1%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">アメリカ</td>
                                <td className="text-right py-2">987</td>
                                <td className="text-right py-2">1,234</td>
                                <td className="text-right py-2">45.6%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">中国</td>
                                <td className="text-right py-2">543</td>
                                <td className="text-right py-2">765</td>
                                <td className="text-right py-2">38.2%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">韓国</td>
                                <td className="text-right py-2">321</td>
                                <td className="text-right py-2">432</td>
                                <td className="text-right py-2">41.5%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">その他</td>
                                <td className="text-right py-2">149</td>
                                <td className="text-right py-2">209</td>
                                <td className="text-right py-2">52.3%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Smartphone className="h-5 w-5 mr-2 text-amber-600" />
                          デバイス
                        </CardTitle>
                        <CardDescription>訪問者のデバイス分布</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-amber-50 p-4 rounded-md text-center">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                            <h4 className="font-medium">モバイル</h4>
                            <p className="text-2xl font-bold">65.4%</p>
                            <p className="text-xs text-green-600">+5.2%</p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-md text-center">
                            <Laptop className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                            <h4 className="font-medium">デスクトップ</h4>
                            <p className="text-2xl font-bold">28.7%</p>
                            <p className="text-xs text-red-600">-3.1%</p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-md text-center">
                            <Tablet className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                            <h4 className="font-medium">タブレット</h4>
                            <p className="text-2xl font-bold">5.9%</p>
                            <p className="text-xs text-red-600">-2.1%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-5 w-5 mr-2 text-amber-600" />
                          新規vs.リピーター
                        </CardTitle>
                        <CardDescription>新規訪問者とリピーターの比率</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-[300px] flex items-center justify-center bg-amber-50 rounded-md">
                          <p className="text-amber-600">グラフ表示エリア</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
                      成長トレンド
                    </CardTitle>
                    <CardDescription>主要指標の成長トレンド</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">訪問者数</span>
                          <span className="text-sm text-green-600">+12.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">ページビュー</span>
                          <span className="text-sm text-green-600">+8.3%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">平均滞在時間</span>
                          <span className="text-sm text-green-600">+5.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "52%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">直帰率</span>
                          <span className="text-sm text-green-600">-2.1%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">コンバージョン率</span>
                          <span className="text-sm text-green-600">+3.7%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                      レポートスケジュール
                    </CardTitle>
                    <CardDescription>定期的なレポート配信設定</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">週間サマリーレポート</span>
                          <Badge className="bg-green-100 text-green-800">有効</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">毎週月曜日 午前9時に配信</p>
                        <p className="text-xs text-gray-500">受信者: admin@yokaunit.com</p>
                      </div>

                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">月間詳細レポート</span>
                          <Badge className="bg-green-100 text-green-800">有効</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">毎月1日 午前9時に配信</p>
                        <p className="text-xs text-gray-500">受信者: admin@yokaunit.com, manager@yokaunit.com</p>
                      </div>

                      <div className="border-b pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">カスタムレポート</span>
                          <Badge className="bg-gray-100 text-gray-800">無効</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">配信スケジュール未設定</p>
                        <p className="text-xs text-gray-500">受信者: 未設定</p>
                      </div>

                      <Button className="w-full bg-amber-600 hover:bg-amber-700">新しいレポートをスケジュール</Button>
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

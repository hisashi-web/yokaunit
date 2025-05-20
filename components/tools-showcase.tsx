"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronRight, Crown, Lock, Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  url: string
  isNew: boolean
  isPremium?: boolean
  isPrivate?: boolean
  likes?: number
}

// カテゴリー別のツールデータ - app/tools/page.tsxと同じデータを使用
const toolsByCategory = {
  all: [] as Tool[],
  popular: [
    {
      id: "password",
      name: "パスワード生成ツール",
      description: "安全なパスワードを簡単に生成。強度チェック機能付き。",
      category: "セキュリティ",
      url: "/tools/password",
      isNew: false,
      likes: 245,
    },
    {
      id: "image-resize",
      name: "画像リサイズツール",
      description: "ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。",
      category: "画像・メディア",
      url: "/tools/image-resize",
      isNew: false,
      likes: 189,
    },
    {
      id: "chinchiro",
      name: "チンチロリン",
      description: "3つのサイコロを使った伝統的な賭けゲーム。リアルな3Dサイコロと本格的なルールで楽しめます。",
      category: "ゲーム",
      url: "/tools/chinchiro",
      isNew: true,
      isPopular: true,
      likes: 95,
    },
    {
      id: "pdf-to-image",
      name: "PDFから画像への変換",
      description: "PDFの各ページをJPG/PNG形式で保存できます。",
      category: "ファイル変換",
      url: "/tools/pdf-to-image",
      isNew: false,
      likes: 156,
    },
    {
      id: "markdown",
      name: "マークダウンエディタ",
      description: "リアルタイムプレビュー付きのシンプルなマークダウンエディタ。",
      category: "テキスト処理",
      url: "/tools/markdown",
      isNew: false,
      likes: 124,
    },
    {
      id: "color-palette",
      name: "カラーパレット生成",
      description: "調和の取れたカラーパレットを自動生成。デザイン作業に役立ちます。",
      category: "デザイン",
      url: "/tools/color-palette",
      isNew: false,
      likes: 112,
    },
    {
      id: "json-yaml",
      name: "JSON⇔YAML変換",
      description: "JSONとYAML形式を相互に変換できるツール。開発者のための便利なユーティリティです。",
      category: "開発者向け",
      url: "/tools/json-yaml",
      isNew: false,
      likes: 89,
    },
    {
      id: "pomodoro",
      name: "シンプルなポモドーロタイマー",
      description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。",
      category: "生産性",
      url: "/tools/pomodoro",
      isNew: true,
      likes: 87,
    },
    {
      id: "csv-json",
      name: "CSV⇔JSON変換",
      description: "CSVとJSON形式のデータを簡単に相互変換。データ分析や開発に役立ちます。",
      category: "ファイル変換",
      url: "/tools/csv-json",
      isNew: false,
      likes: 76,
    },
    {
      id: "todo",
      name: "シンプルToDoリスト",
      description: "シンプルで使いやすいタスク管理ツール。ブラウザに保存されるので登録不要です。",
      category: "生産性",
      url: "/tools/todo",
      isNew: false,
      likes: 78,
    },
  ],
  new: [
    {
      id: "chinchiro",
      name: "チンチロリン",
      description: "3つのサイコロを使った伝統的な賭けゲーム。リアルな3Dサイコロと本格的なルールで楽しめます。",
      category: "ゲーム",
      url: "/tools/chinchiro",
      isNew: true,
      isPopular: true,
      likes: 95,
    },
    {
      id: "pomodoro",
      name: "シンプルなポモドーロタイマー",
      description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。",
      category: "生産性",
      url: "/tools/pomodoro",
      isNew: true,
      likes: 87,
    },
    {
      id: "image-editor-pro",
      name: "プロ仕様画像編集ツール",
      description: "高度な画像編集機能を備えたプロ仕様ツール。",
      category: "画像・メディア",
      url: "/tools/premium-tool",
      isNew: true,
      isPremium: true,
      likes: 42,
    },
    {
      id: "unit-converter",
      name: "単位変換ツール",
      description: "長さ、重さ、温度など様々な単位を簡単に変換できます。",
      category: "計算ツール",
      url: "/tools/unit-converter",
      isNew: true,
      likes: 35,
    },
    {
      id: "meditation-timer",
      name: "瞑想タイマー",
      description: "瞑想や集中作業のためのタイマー。リラックスした音楽と通知機能付き。",
      category: "健康・生活",
      url: "/tools/meditation-timer",
      isNew: true,
      likes: 33,
    },
    {
      id: "calorie-calculator",
      name: "カロリー計算機",
      description: "食品のカロリーを計算し、日々の摂取カロリーを管理できます。",
      category: "健康・生活",
      url: "/tools/calorie-calculator",
      isNew: true,
      likes: 31,
    },
    {
      id: "loan-calculator",
      name: "ローン計算機",
      description: "住宅ローンや自動車ローンの月々の支払額を簡単に計算できます。",
      category: "計算ツール",
      url: "/tools/loan-calculator",
      isNew: true,
      likes: 29,
    },
    {
      id: "flashcards",
      name: "フラッシュカード学習",
      description: "自分だけのフラッシュカードを作成して効率的に学習できるツール。語学学習に最適です。",
      category: "学習・教育",
      url: "/tools/flashcards",
      isNew: true,
      likes: 27,
    },
    {
      id: "dice-roller",
      name: "サイコロシミュレーター",
      description: "様々な面数のサイコロを振れるシミュレーター。ボードゲームやTRPGに最適です。",
      category: "ゲーム",
      url: "/tools/dice-roller",
      isNew: true,
      likes: 24,
    },
    {
      id: "data-analyzer",
      name: "企業向けデータ分析ツール",
      description: "高度なデータ分析と可視化が可能な企業向け特別ツール。限定公開です。",
      category: "ビジネス",
      url: "/tools/private-tool",
      isNew: true,
      isPrivate: true,
      likes: 15,
    },
  ],
}

// すべてのカテゴリーを「all」に追加
toolsByCategory.all = [...toolsByCategory.popular, ...toolsByCategory.new]

export function ToolsShowcase() {
  const [activeCategory, setActiveCategory] = useState("popular")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [displayCount, setDisplayCount] = useState(10)
  const router = useRouter()
  const { toast } = useToast()

  // 画面サイズに応じて表示数を調整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setDisplayCount(10) // XL以上の画面
      } else if (window.innerWidth >= 1024) {
        setDisplayCount(10) // LG画面
      } else if (window.innerWidth >= 768) {
        setDisplayCount(9) // MD画面
      } else if (window.innerWidth >= 640) {
        setDisplayCount(6) // SM画面
      } else {
        setDisplayCount(4) // XS画面
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ページ遷移時にトップにスクロール
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0)
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // ログイン状態とお気に入りの確認
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const savedFavorites = localStorage.getItem("favorites")
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const toggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast({
        title: "ログインが必要です",
        description: "お気に入り機能を使用するにはログインしてください",
        variant: "destructive",
      })
      return
    }

    let newFavorites: string[]
    if (favorites.includes(toolId)) {
      newFavorites = favorites.filter((id) => id !== toolId)
      toast({
        title: "お気に入りから削除しました",
        description: "マイページのお気に入りリストから削除されました",
      })
    } else {
      newFavorites = [...favorites, toolId]
      toast({
        title: "お気に入りに追加しました",
        description: "マイページのお気に入りリストから確認できます",
      })
    }

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    window.dispatchEvent(new Event("storage"))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // 現在のカテゴリーのツールを取得し、表示数に制限
  const currentTools = toolsByCategory[activeCategory as keyof typeof toolsByCategory].slice(0, displayCount)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">ツール一覧</h2>
        <Link href="/tools" className="text-sm text-blue-600 hover:underline flex items-center">
          もっと見る <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <Tabs defaultValue="popular" className="w-full mb-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex min-w-max">
            <TabsTrigger value="popular" onClick={() => setActiveCategory("popular")}>
              人気のツール
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setActiveCategory("new")}>
              新着ツール
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3"
          >
            {currentTools.map((tool) => (
              <motion.div key={tool.id} variants={item}>
                <Link href={tool.url} onClick={() => window.scrollTo(0, 0)}>
                  <Card className="h-full hover:shadow-md transition-all duration-300 hover:border-blue-200 relative bg-white/80 backdrop-blur-sm hover:translate-y-[-2px]">
                    {/* プレミアムまたは限定公開バッジ */}
                    {tool.isPremium && (
                      <div className="absolute top-0 right-0">
                        <Badge
                          className="rounded-bl-lg rounded-tr-lg bg-yellow-100 text-yellow-800 flex items-center gap-1 px-1 py-0.5"
                          title="プレミアム会員限定ツール"
                        >
                          <Crown className="h-3 w-3" />
                        </Badge>
                      </div>
                    )}
                    {tool.isPrivate && (
                      <div className="absolute top-0 right-0">
                        <Badge
                          className="rounded-bl-lg rounded-tr-lg bg-blue-100 text-blue-800 flex items-center gap-1 px-1 py-0.5"
                          title="限定公開ツール"
                        >
                          <Lock className="h-3 w-3" />
                        </Badge>
                      </div>
                    )}

                    {/* お気に入りボタン */}
                    <button
                      className="absolute top-1 left-1 text-gray-400 hover:text-red-500 transition-colors z-10"
                      onClick={(e) => toggleFavorite(e, tool.id)}
                      title={favorites.includes(tool.id) ? "お気に入りから削除" : "お気に入りに追加"}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(tool.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>

                    <CardContent className="p-2 pt-6">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{tool.name}</h3>
                          {tool.isNew && !tool.isPremium && !tool.isPrivate && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">{tool.description}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {tool.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Heart className="h-3 w-3 mr-0.5 text-red-400" />
                            {tool.likes || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => {
                router.push("/tools")
                window.scrollTo(0, 0)
              }}
            >
              すべてのツールを見る
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

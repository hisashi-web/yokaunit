"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Lock, Crown, Filter, Heart, X, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { BackgroundAnimation } from "@/components/background-animation"
import { ScrollToTop } from "@/components/scroll-to-top"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  url: string
  isNew: boolean
  isPopular?: boolean
  isPremium?: boolean
  isPrivate?: boolean
  likes?: number
}

// カテゴリー別のツールデータ
const allToolsData: Tool[] = [
  // メディア
  {
    id: "pomodoro",
    name: "シンプルなポモドーロタイマー",
    description:
      "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付き。作業効率を高めたい方におすすめです。",
    category: "生産性",
    subcategory: "タイマー",
    tags: ["タイマー", "集中力", "生産性向上"],
    url: "/tools/pomodoro",
    isNew: true,
    isPopular: true,
    likes: 87,
  },
  {
    id: "image-resize",
    name: "画像リサイズツール",
    description: "ドラッグ&ドロップで簡単に画像サイズを変更できます。複数形式に対応。SNS投稿用のサイズ設定も簡単です。",
    category: "画像・メディア",
    subcategory: "画像編集",
    tags: ["画像編集", "リサイズ", "SNS最適化"],
    url: "/tools/image-resize",
    isNew: false,
    isPopular: true,
    likes: 189,
  },
  {
    id: "video-trim",
    name: "動画トリミングツール",
    description: "オンラインで簡単に動画の不要な部分をカットできます。登録不要で即座に利用可能です。",
    category: "画像・メディア",
    subcategory: "動画編集",
    tags: ["動画編集", "トリミング", "カット"],
    url: "/tools/video-trim",
    isNew: false,
    likes: 65,
  },
  {
    id: "audio-recorder",
    name: "シンプル音声レコーダー",
    description: "ブラウザ上で高品質な音声録音ができます。会議や講義の録音に最適です。",
    category: "画像・メディア",
    subcategory: "音声",
    tags: ["録音", "音声", "会議"],
    url: "/tools/audio-recorder",
    isNew: false,
    likes: 42,
  },
  {
    id: "image-editor-pro",
    name: "プロ仕様画像編集ツール",
    description: "高度な画像編集機能を備えたプロ仕様ツール。背景除去、フィルター、AIによる画像補正など。",
    category: "画像・メディア",
    subcategory: "画像編集",
    tags: ["画像編集", "プロ仕様", "AI補正"],
    url: "/tools/premium-tool",
    isNew: true,
    isPopular: true,
    isPremium: true,
    likes: 42,
  },

  // ユーティリティ
  {
    id: "markdown",
    name: "マークダウンエディタ",
    description: "リアルタイムプレビュー付きのシンプルなマークダウンエディタ。ブログ記事やドキュメント作成に便利です。",
    category: "テキスト処理",
    subcategory: "テキスト",
    tags: ["マークダウン", "エディタ", "文書作成"],
    url: "/tools/markdown",
    isNew: false,
    isPopular: true,
    likes: 124,
  },
  {
    id: "password",
    name: "パスワード生成ツール",
    description: "安全なパスワードを簡単に生成。強度チェック機能付き。オンラインセキュリティ向上に役立ちます。",
    category: "セキュリティ",
    subcategory: "セキュリティ",
    tags: ["パスワード", "セキュリティ", "暗号"],
    url: "/tools/password",
    isNew: true,
    likes: 245,
  },
  {
    id: "todo",
    name: "シンプルToDoリスト",
    description: "シンプルで使いやすいタスク管理ツール。ブラウザに保存されるので登録不要です。",
    category: "生産性",
    subcategory: "タスク管理",
    tags: ["タスク管理", "ToDoリスト", "生産性"],
    url: "/tools/todo",
    isNew: false,
    likes: 78,
  },
  {
    id: "notes",
    name: "オンラインメモ帳",
    description: "シンプルなメモ帳アプリ。自動保存機能付きで、アイデアをすぐにメモできます。",
    category: "テキスト処理",
    subcategory: "テキスト",
    tags: ["メモ", "ノート", "テキスト"],
    url: "/tools/notes",
    isNew: false,
    likes: 56,
  },

  // 変換ツール
  {
    id: "pdf-to-image",
    name: "PDFから画像への変換",
    description: "PDFの各ページをJPG/PNG形式で保存できます。高品質な変換で文書共有が簡単になります。",
    category: "ファイル変換",
    subcategory: "ファイル変換",
    tags: ["PDF", "画像変換", "ドキュメント"],
    url: "/tools/pdf-to-image",
    isNew: false,
    isPopular: true,
    likes: 156,
  },
  {
    id: "json-yaml",
    name: "JSON⇔YAML変換",
    description: "JSONとYAML形式を相互に変換できるツール。開発者のための便利なユーティリティです。",
    category: "開発者向け",
    subcategory: "開発者向け",
    tags: ["JSON", "YAML", "データ変換"],
    url: "/tools/json-yaml",
    isNew: false,
    likes: 89,
  },
  {
    id: "csv-json",
    name: "CSV⇔JSON変換",
    description: "CSVとJSON形式のデータを簡単に相互変換。データ分析や開発に役立ちます。",
    category: "ファイル変換",
    subcategory: "データ変換",
    tags: ["CSV", "JSON", "データ処理"],
    url: "/tools/csv-json",
    isNew: false,
    likes: 76,
  },
  {
    id: "unit-converter",
    name: "単位変換ツール",
    description: "長さ、重さ、温度など様々な単位を簡単に変換できます。日常生活や学習に役立ちます。",
    category: "計算ツール",
    subcategory: "単位変換",
    tags: ["単位変換", "計算", "数値"],
    url: "/tools/unit-converter",
    isNew: true,
    likes: 35,
  },

  // 計算ツール
  {
    id: "percentage",
    name: "パーセント計算機",
    description: "割引計算や増加率など、様々なパーセント計算が簡単にできます。",
    category: "計算ツール",
    subcategory: "基本計算",
    tags: ["計算", "パーセント", "割引"],
    url: "/tools/percentage",
    isNew: false,
    likes: 48,
  },
  {
    id: "date-calculator",
    name: "日付計算ツール",
    description: "二つの日付の間の日数や、特定の日数後の日付を計算できます。",
    category: "計算ツール",
    subcategory: "日付・時間",
    tags: ["日付", "計算", "カレンダー"],
    url: "/tools/date-calculator",
    isNew: false,
    likes: 37,
  },
  {
    id: "bmi-calculator",
    name: "BMI計算機",
    description: "身長と体重からBMIを計算し、健康状態の目安を確認できます。",
    category: "健康・生活",
    subcategory: "健康指標",
    tags: ["BMI", "健康", "計算"],
    url: "/tools/bmi-calculator",
    isNew: false,
    likes: 52,
  },
  {
    id: "loan-calculator",
    name: "ローン計算機",
    description: "住宅ローンや自動車ローンの月々の支払額を簡単に計算できます。",
    category: "計算ツール",
    subcategory: "金融",
    tags: ["ローン", "金融", "計算"],
    url: "/tools/loan-calculator",
    isNew: true,
    likes: 29,
  },
  {
    id: "tax-calculator",
    name: "消費税計算機",
    description: "税込・税抜価格を簡単に計算。軽減税率にも対応しています。",
    category: "計算ツール",
    subcategory: "金融",
    tags: ["消費税", "計算", "金融"],
    url: "/tools/tax-calculator",
    isNew: false,
    likes: 43,
  },
  {
    id: "calorie-calculator",
    name: "カロリー計算機",
    description: "食品のカロリーを計算し、日々の摂取カロリーを管理できます。",
    category: "健康・生活",
    subcategory: "栄養",
    tags: ["カロリー", "健康", "ダイエット"],
    url: "/tools/calorie-calculator",
    isNew: true,
    likes: 31,
  },

  // ゲーム・エンターテイメント
  {
    id: "random-generator",
    name: "ランダム生成ツール",
    description: "数字、文字列、リストからのランダム選択ができるツール。くじ引きやゲームに便利です。",
    category: "ゲーム",
    subcategory: "ランダム",
    tags: ["ランダム", "くじ引き", "選択"],
    url: "/tools/random-generator",
    isNew: false,
    likes: 67,
  },
  {
    id: "dice-roller",
    name: "サイコロシミュレーター",
    description: "様々な面数のサイコロを振れるシミュレーター。ボードゲームやTRPGに最適です。",
    category: "ゲーム",
    subcategory: "シミュレーター",
    tags: ["サイコロ", "ゲーム", "TRPG"],
    url: "/tools/dice-roller",
    isNew: true,
    likes: 24,
  },
  {
    id: "chinchiro",
    name: "チンチロリン",
    description: "3つのサイコロを使った伝統的な賭けゲーム。リアルな3Dサイコロと本格的なルールで楽しめます。",
    category: "ゲーム",
    subcategory: "賭けゲーム",
    tags: ["サイコロ", "ゲーム", "賭け"],
    url: "/tools/chinchiro",
    isNew: true,
    isPopular: true,
    likes: 95,
  },
  {
    id: "name-generator",
    name: "名前生成ツール",
    description: "キャラクター名やビジネス名などをランダムに生成できるツール。創作活動に役立ちます。",
    category: "ゲーム",
    subcategory: "創作",
    tags: ["名前", "創作", "ランダム"],
    url: "/tools/name-generator",
    isNew: false,
    likes: 38,
  },
  {
    id: "color-palette",
    name: "カラーパレット生成",
    description: "調和の取れたカラーパレットを自動生成。デザイン作業に役立ちます。",
    category: "デザイン",
    subcategory: "カラー",
    tags: ["カラー", "デザイン", "パレット"],
    url: "/tools/color-palette",
    isNew: false,
    isPopular: true,
    likes: 112,
  },

  // 教育・学習
  {
    id: "flashcards",
    name: "フラッシュカード学習",
    description: "自分だけのフラッシュカードを作成して効率的に学習できるツール。語学学習に最適です。",
    category: "学習・教育",
    subcategory: "学習",
    tags: ["フラッシュカード", "学習", "暗記"],
    url: "/tools/flashcards",
    isNew: true,
    likes: 27,
  },
  {
    id: "math-practice",
    name: "算数練習ツール",
    description: "基本的な算数問題を自動生成して練習できるツール。お子様の学習に役立ちます。",
    category: "学習・教育",
    subcategory: "算数",
    tags: ["算数", "練習", "学習"],
    url: "/tools/math-practice",
    isNew: false,
    likes: 19,
  },
  {
    id: "typing-practice",
    name: "タイピング練習",
    description: "タイピングスピードと正確性を向上させるための練習ツール。初心者から上級者まで対応。",
    category: "学習・教育",
    subcategory: "タイピング",
    tags: ["タイピング", "練習", "キーボード"],
    url: "/tools/typing-practice",
    isNew: false,
    likes: 45,
  },

  // 健康・ライフスタイル
  {
    id: "meditation-timer",
    name: "瞑想タイマー",
    description: "瞑想や集中作業のためのタイマー。リラックスした音楽と通知機能付き。",
    category: "健康・生活",
    subcategory: "マインドフルネス",
    tags: ["瞑想", "タイマー", "リラックス"],
    url: "/tools/meditation-timer",
    isNew: true,
    likes: 33,
  },
  {
    id: "water-reminder",
    name: "水分摂取リマインダー",
    description: "適切な水分摂取を促すリマインダーツール。健康的な生活習慣をサポートします。",
    category: "健康・生活",
    subcategory: "健康管理",
    tags: ["水分", "リマインダー", "健康"],
    url: "/tools/water-reminder",
    isNew: false,
    likes: 28,
  },
  {
    id: "sleep-calculator",
    name: "睡眠サイクル計算機",
    description: "睡眠サイクルに基づいて最適な就寝・起床時間を計算するツール。",
    category: "健康・生活",
    subcategory: "睡眠",
    tags: ["睡眠", "サイクル", "健康"],
    url: "/tools/sleep-calculator",
    isNew: false,
    likes: 41,
  },

  // 企業向け特別ツール
  {
    id: "data-analyzer",
    name: "企業向けデータ分析ツール",
    description: "高度なデータ分析と可視化が可能な企業向け特別ツール。限定公開です。",
    category: "ビジネス",
    subcategory: "データ分析",
    tags: ["データ分析", "ビジネス", "可視化"],
    url: "/tools/private-tool",
    isNew: true,
    isPrivate: true,
    likes: 15,
  },
  {
    id: "report-generator",
    name: "ビジネスレポート生成",
    description: "データからプロフェッショナルなビジネスレポートを自動生成するプレミアムツール。",
    category: "ビジネス",
    subcategory: "レポート",
    tags: ["レポート", "ビジネス", "自動生成"],
    url: "/tools/premium-tool",
    isNew: false,
    isPremium: true,
    likes: 22,
  },
  {
    id: "project-planner",
    name: "プロジェクト計画ツール",
    description: "プロジェクトのタイムラインとリソース配分を計画するための高度なツール。",
    category: "ビジネス",
    subcategory: "プロジェクト管理",
    tags: ["プロジェクト", "計画", "管理"],
    url: "/tools/premium-tool",
    isNew: false,
    isPremium: true,
    likes: 18,
  },
]

// カテゴリーリスト（重複なし）
const categories = Array.from(new Set(allToolsData.map((tool) => tool.category)))

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"popular" | "new" | "name">("popular")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const itemsPerPage = 15
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // ページ遷移時にトップにスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  // URLからの検索クエリを取得
  useEffect(() => {
    const search = searchParams.get("search")
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

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

  // フィルタリングとソート
  const getFilteredTools = () => {
    let filtered = [...allToolsData]

    // タブによるフィルタリング
    if (activeTab === "popular") {
      filtered = filtered.filter((tool) => tool.isPopular)
    } else if (activeTab === "new") {
      filtered = filtered.filter((tool) => tool.isNew)
    } else if (activeTab === "premium") {
      filtered = filtered.filter((tool) => tool.isPremium)
    } else if (activeTab === "private") {
      filtered = filtered.filter((tool) => tool.isPrivate)
    } else if (activeTab !== "all") {
      filtered = filtered.filter((tool) => tool.category === activeTab)
    }

    // カテゴリーによるフィルタリング
    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // ソート
    if (sortOrder === "popular") {
      filtered.sort((a, b) => {
        const aLikes = a.likes || 0
        const bLikes = b.likes || 0
        return bLikes - aLikes
      })
    } else if (sortOrder === "new") {
      filtered.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return 0
      })
    } else if (sortOrder === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }

  const filteredTools = getFilteredTools()
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage)
  const currentTools = filteredTools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 検索時は1ページ目に戻る
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSortOrder("popular")
    setCurrentPage(1)
  }

  // アニメーション設定
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

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <BackgroundAnimation />
      <ScrollToTop />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ツール一覧</h1>
            <p className="text-gray-600 text-sm">
              様々なカテゴリーの便利なツールを探索しましょう。お気に入りのツールを見つけて、作業を効率化しましょう。
            </p>
          </motion.div>

          {/* 検索バーとフィルターボタン */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors group-hover:text-blue-500" />
                <Input
                  type="search"
                  placeholder="ツールを検索..."
                  className="pl-10 transition-all duration-300 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                検索
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">フィルター</span>
              </Button>
            </form>
          </motion.div>

          {/* フィルターとソート（折りたたみ可能） */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm relative"
              >
                <button
                  onClick={() => setShowFilters(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-1 min-w-[150px]">
                    <Select
                      value={selectedCategory || ""}
                      onValueChange={(value) => {
                        setSelectedCategory(value === "all_categories" ? null : value)
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs border-gray-200 hover:border-blue-300 transition-all duration-300">
                        <SelectValue placeholder="カテゴリー" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_categories">すべて</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1 min-w-[120px]">
                    <Select
                      value={sortOrder}
                      onValueChange={(value: "popular" | "new" | "name") => setSortOrder(value)}
                    >
                      <SelectTrigger className="h-9 text-xs border-gray-200 hover:border-blue-300 transition-all duration-300">
                        <SelectValue placeholder="並び替え" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">人気順</SelectItem>
                        <SelectItem value="new">新着順</SelectItem>
                        <SelectItem value="name">名前順</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs h-9 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    クリア
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Tabs
              defaultValue="all"
              className="w-full mb-6"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                setCurrentPage(1)
              }}
            >
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex min-w-max bg-gray-100/80 backdrop-blur-sm">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    すべて
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    人気
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    新着
                  </TabsTrigger>
                  <TabsTrigger
                    value="premium"
                    className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    <Crown className="h-3 w-3 text-yellow-500" />
                    プレミアム
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    <Lock className="h-3 w-3 text-blue-500" />
                    限定公開
                  </TabsTrigger>
                  <TabsTrigger
                    value="ゲーム"
                    className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                  >
                    <Gamepad2 className="h-3 w-3" />
                    ゲーム
                  </TabsTrigger>
                  {categories
                    .filter((category) => category !== "ゲーム")
                    .slice(0, 4)
                    .map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all duration-300"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-4">
                {currentTools.length > 0 ? (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                  >
                    {currentTools.map((tool) => (
                      <motion.div key={tool.id} variants={item}>
                        <Link href={tool.url} className="block">
                          <Card className="h-full hover:shadow-md transition-all duration-300 hover:border-blue-200 relative bg-white/80 backdrop-blur-sm hover:translate-y-[-2px]">
                            {/* プレミアムまたは限定公開バッジ */}
                            {tool.isPremium && (
                              <div className="absolute top-0 right-0">
                                <Badge
                                  className="rounded-bl-lg rounded-tr-lg bg-yellow-100 text-yellow-800 flex items-center gap-1 px-2 py-0.5"
                                  title="プレミアム会員限定ツール"
                                >
                                  <Crown className="h-3 w-3" />
                                </Badge>
                              </div>
                            )}
                            {tool.isPrivate && (
                              <div className="absolute top-0 right-0">
                                <Badge
                                  className="rounded-bl-lg rounded-tr-lg bg-blue-100 text-blue-800 flex items-center gap-1 px-2 py-0.5"
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
                              <Heart
                                className={`h-4 w-4 ${favorites.includes(tool.id) ? "fill-red-500 text-red-500" : ""}`}
                              />
                            </button>

                            <CardContent className="p-2 pt-6">
                              <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{tool.name}</h3>
                                  {tool.isNew && !tool.isPremium && !tool.isPrivate && (
                                    <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{tool.description}</p>
                                <div className="mt-auto flex justify-between items-center">
                                  <Badge variant="outline" className="text-xs px-1 py-0 border-gray-200">
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
                ) : (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm"
                  >
                    <p className="text-gray-500 mb-4">該当するツールが見つかりませんでした。</p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                    >
                      フィルターをリセット
                    </Button>
                  </motion.div>
                )}

                {/* ページネーション */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex justify-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // 現在のページを中心に表示
                        let pageNum = i + 1
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageNum = currentPage - 3 + i
                          }
                          if (pageNum > totalPages) {
                            pageNum = totalPages - (4 - i)
                          }
                        }
                        return pageNum
                      }).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 p-0 ${
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          } transition-all duration-300`}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

type PostStatus = "選定中" | "作成中" | "完了"

interface Post {
  id: number
  title: string
  description: string
  likes: number
  comments: number
  status: PostStatus
  date: string
}

const popularPosts: Post[] = [
  {
    id: 1,
    title: "MP4からMP3に変換できる無料ツール",
    description: "YouTubeの音声だけを抽出して保存したいです。シンプルで使いやすいUIが希望です。",
    likes: 124,
    comments: 18,
    status: "作成中",
    date: "2023-12-15",
  },
  {
    id: 2,
    title: "プログラミング学習進捗管理アプリ",
    description: "学習時間や完了したコースを記録できるダッシュボード形式のアプリが欲しいです。",
    likes: 98,
    comments: 12,
    status: "選定中",
    date: "2023-12-18",
  },
  {
    id: 3,
    title: "シンプルなポモドーロタイマー",
    description: "集中作業と休憩を管理できるシンプルなタイマーツール。通知機能付きだと嬉しいです。",
    likes: 87,
    comments: 9,
    status: "完了",
    date: "2023-12-10",
  },
  {
    id: 4,
    title: "レシピ検索＆栄養素計算ツール",
    description: "材料から検索でき、完成した料理の栄養素も計算できるツールが欲しいです。",
    likes: 76,
    comments: 14,
    status: "選定中",
    date: "2023-12-20",
  },
]

const recentPosts: Post[] = [
  {
    id: 5,
    title: "PDFを画像に変換するツール",
    description: "PDFの各ページをJPGやPNG形式で保存できるシンプルなツールが欲しいです。",
    likes: 23,
    comments: 5,
    status: "選定中",
    date: "2023-12-22",
  },
  {
    id: 6,
    title: "シンプルな家計簿アプリ",
    description: "収支を簡単に記録できて、月ごとのグラフも見られる家計簿アプリが欲しいです。",
    likes: 18,
    comments: 3,
    status: "選定中",
    date: "2023-12-21",
  },
  {
    id: 7,
    title: "オンライン会議用バーチャル背景ジェネレーター",
    description: "テンプレートから選んでカスタマイズできるバーチャル背景作成ツール",
    likes: 15,
    comments: 2,
    status: "選定中",
    date: "2023-12-20",
  },
  {
    id: 8,
    title: "マークダウンエディタ＆プレビュー",
    description: "リアルタイムでプレビューできるシンプルなマークダウンエディタが欲しいです。",
    likes: 12,
    comments: 1,
    status: "選定中",
    date: "2023-12-19",
  },
]

const getStatusColor = (status: PostStatus) => {
  switch (status) {
    case "選定中":
      return "bg-yellow-100 text-yellow-800"
    case "作成中":
      return "bg-blue-100 text-blue-800"
    case "完了":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: PostStatus) => {
  switch (status) {
    case "選定中":
      return <AlertCircle className="h-3.5 w-3.5" />
    case "作成中":
      return <Clock className="h-3.5 w-3.5" />
    case "完了":
      return <CheckCircle className="h-3.5 w-3.5" />
    default:
      return null
  }
}

export function PostListing() {
  const [activeTab, setActiveTab] = useState("popular")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">投稿された要望</h2>
        <Tabs defaultValue="popular" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="popular" onClick={() => setActiveTab("popular")}>
              人気の要望
            </TabsTrigger>
            <TabsTrigger value="recent" onClick={() => setActiveTab("recent")}>
              最近の要望
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {(activeTab === "popular" ? popularPosts : recentPosts).map((post) => (
          <motion.div key={post.id} variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2">{post.title}</CardTitle>
                  <Badge className={`${getStatusColor(post.status)} flex items-center gap-1 px-2 py-1`}>
                    {getStatusIcon(post.status)}
                    <span>{post.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <div>{post.date}</div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

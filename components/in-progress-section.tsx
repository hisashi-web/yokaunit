"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface ProgressItem {
  id: number
  title: string
  status: "作成中" | "完成"
  progress: number
  date: string
  url?: string
}

const progressItems: ProgressItem[] = [
  {
    id: 1,
    title: "MP4からMP3に変換できる無料ツール",
    status: "作成中",
    progress: 75,
    date: "2023-12-20",
  },
  {
    id: 2,
    title: "シンプルなポモドーロタイマー",
    status: "完成",
    progress: 100,
    date: "2023-12-18",
    url: "#",
  },
  {
    id: 3,
    title: "画像一括リサイズツール",
    status: "作成中",
    progress: 40,
    date: "2023-12-22",
  },
]

export function InProgressSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">現在進行中のページ</h2>

      <div className="space-y-4">
        {progressItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Card className="overflow-hidden transition-all duration-300 hover:border-blue-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center">
                    {item.title}
                    {item.url && (
                      <a href={item.url} className="ml-2 text-blue-500 hover:text-blue-700">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </CardTitle>
                  <Badge
                    className={`
                      flex items-center gap-1 px-2 py-0.5
                      ${item.status === "作成中" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                    `}
                  >
                    {item.status === "作成中" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    <span>{item.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">{item.date}</span>
                  <span className="font-medium">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.status === "完成" ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

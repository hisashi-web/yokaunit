"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export function CurrentlyBuilding() {
  const inProgressTools = [
    {
      name: "MP4からMP3に変換できる無料ツール",
      description: "YouTubeの音声だけを抽出して保存したいときに便利。高品質な音声変換と簡単な操作性を実現します。",
      category: "メディア変換",
      estimatedCompletion: "来週公開予定",
    },
    {
      name: "画像一括リサイズツール",
      description: "複数の画像を一度にリサイズ。SNS投稿用やWebサイト用など、用途に合わせた最適化が可能です。",
      category: "画像編集",
      estimatedCompletion: "2週間以内に公開予定",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-6"
    >
      <section className="mb-8">
        <motion.h2
          className="text-xl font-bold text-gray-900 mb-4 relative inline-block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          現在開発中のツール
          <motion.span
            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.h2>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {inProgressTools.map((tool, index) => (
          <Card key={index} className="border-blue-100">
            <CardContent className="p-3">
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm text-gray-900">{tool.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{tool.category}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1.5 line-clamp-3">{tool.description}</p>
                <span className="text-xs text-blue-600 font-medium">{tool.estimatedCompletion}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

export function AdminMessage() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-blue-100">
        <CardHeader className="pb-2 pt-3 px-3 bg-blue-50 flex flex-row items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
            <AvatarFallback>YU</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm text-blue-900">開発者からのメッセージ</h3>
            <p className="text-xs text-blue-700">最終更新: 2023年12月22日</p>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <p className="text-xs text-gray-700 mb-2">
            今週は企業案件対応中です！来週から新しい要望の選定を再開します。
            ポモドーロタイマーが完成しました！ぜひご利用ください。
          </p>
          <p className="text-xs text-gray-700">MP4→MP3変換ツールは来週完成予定です。お楽しみに！</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

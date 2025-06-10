"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Instagram, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export function SocialRequestBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-gray-900 mb-1">新しいツールのアイデアはありますか？</h3>
            <p className="text-sm text-gray-600">
              SNSで気軽にリクエストしてください。あなたのアイデアが無料で次のツールになるかも！
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/yokaunit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>
            <a
              href="https://threads.net/yokaunit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Threads</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

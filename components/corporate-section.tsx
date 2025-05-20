"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Shield, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function CorporateSection() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-blue-900 flex items-center">
            <Lock className="h-4 w-4 mr-1.5 text-blue-700" />
            企業の方へ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <ul className="text-xs text-gray-700 mb-3 space-y-1.5">
            <li className="flex items-start">
              <Shield className="h-3.5 w-3.5 mr-1.5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>機密保持契約（NDA）対応可能</span>
            </li>
            <li className="flex items-start">
              <Lock className="h-3.5 w-3.5 mr-1.5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>パスワード付き限定公開ページ</span>
            </li>
            <li className="flex items-start">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>御社専用カスタマイズ対応</span>
            </li>
          </ul>
          <Button
            size="sm"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-1.5"
            onClick={() => router.push("/corporate")}
          >
            🔒 企業の方はこちら
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

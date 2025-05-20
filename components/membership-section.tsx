"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function MembershipSection() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-yellow-900 flex items-center">
            <Star className="h-4 w-4 mr-1.5 text-yellow-500 fill-yellow-500" />
            有料会員特典
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <ul className="text-xs text-gray-700 mb-3 space-y-1.5">
            <li className="flex items-start">
              <Check className="h-3.5 w-3.5 mr-1.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>プレミアムツール・ページへのアクセス</span>
            </li>
            <li className="flex items-start">
              <Check className="h-3.5 w-3.5 mr-1.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>要望の優先選定・開発</span>
            </li>
            <li className="flex items-start">
              <Check className="h-3.5 w-3.5 mr-1.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span>広告非表示モード</span>
            </li>
          </ul>
          <Button
            size="sm"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1.5"
            onClick={() => router.push("/premium")}
          >
            ⭐ 有料会員になる
          </Button>
          <p className="text-xs text-center mt-1.5 text-gray-500">月額500円から / いつでも解約可能</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

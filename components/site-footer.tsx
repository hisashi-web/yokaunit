"use client"

import Link from "next/link"
import { Instagram, MessageCircle, Building2, Crown } from "lucide-react"
import { motion } from "framer-motion"

export function SiteFooter() {
  return (
    // フッターにアニメーションとスタイルを追加
    <footer className="border-t bg-white/80 backdrop-blur-sm py-6 md:py-0">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-6 md:py-8">
          {/* 各セクションにアニメーションを追加 */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold text-blue-600">YokaUnit</span>
            </Link>
            <p className="mt-2 text-xs text-gray-600">
              ユーザーの"あったらいいな"を実現するツール・ページ作成プラットフォーム
            </p>
            <div className="flex space-x-3 mt-3">
              <a
                href="https://instagram.com/yokaunit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://threads.net/yokaunit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Threads</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xs font-semibold text-gray-900 mb-2">主要ツール</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/tools/password" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  パスワード生成
                </Link>
              </li>
              <li>
                <Link href="/tools/pomodoro" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  ポモドーロタイマー
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/image-resize"
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
                >
                  画像リサイズ
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  すべてのツール
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xs font-semibold text-gray-900 mb-2">サポート</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/faq" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xs font-semibold text-gray-900 mb-2">アカウント</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                  新規登録
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                >
                  <Crown className="h-2.5 w-2.5 mr-1 text-yellow-500" />
                  有料会員プラン
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center"
                >
                  <Building2 className="h-2.5 w-2.5 mr-1 text-blue-500" />
                  企業の方へ
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} YokaUnit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

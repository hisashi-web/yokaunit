"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut, Building2, Crown, Settings, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { isLoggedIn, profile, isPremium, isAdmin, isDeveloper, signOut } = useAuth()
  const username = profile?.username || profile?.full_name || "ユーザー"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tools?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const navigationItems = [
    { href: "/tools", title: "ツール一覧" },
    { href: "/premium", title: "有料会員" },
    { href: "/corporate", title: "企業の方へ" },
    { href: "/contact", title: "お問い合わせ" },
    { href: "/sitemap", title: "サイトマップ" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className={`text-xl font-bold ${isDeveloper ? "text-amber-600" : "text-blue-600"}`}>YokaUnit</span>
              {isDeveloper && (
                <Badge className="ml-2 bg-amber-200 text-amber-800 hover:bg-amber-300">開発者モード</Badge>
              )}
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 relative group",
                  pathname === item.href ? "text-blue-600" : "text-gray-600 hover:text-blue-600",
                )}
              >
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {/* デスクトップ検索フォーム */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="ツールを検索..."
                className="pl-9 w-[180px] h-9 bg-gray-50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* モバイル検索アイコン */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 ${isDeveloper ? "text-amber-700 hover:bg-amber-100" : ""}`}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline-block max-w-[100px] truncate">
                      {isDeveloper ? "開発者" : username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => router.push("/account")}>マイページ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/account/favorites")}>お気に入り</DropdownMenuItem>

                  {(isAdmin || isDeveloper) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                        <LayoutDashboard className="h-4 w-4 mr-2 text-amber-600" />
                        管理ダッシュボード
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/admin/tools")}>
                        <Settings className="h-4 w-4 mr-2 text-amber-600" />
                        ツール管理
                      </DropdownMenuItem>
                    </>
                  )}

                  {isPremium ? (
                    <DropdownMenuItem onClick={() => router.push("/tools/premium-tool")}>
                      <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                      プレミアムツール
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push("/premium")}>
                      <Crown className="h-4 w-4 mr-2 text-gray-400" />
                      有料会員になる
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => router.push("/signup")}>
                  新規登録
                </Button>
                <Button size="sm" className="hidden md:flex" onClick={() => router.push("/login")}>
                  ログイン
                </Button>
              </div>
            )}

            {/* モバイルメニューボタン */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* モバイル検索フォーム */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="ツールを検索..."
                    className="pl-9 w-full bg-gray-50 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit">検索</Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              isDeveloper ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="container mx-auto px-4 py-3 space-y-3">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/tools"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ツール一覧
                </Link>
                <Link
                  href="/premium"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                  有料会員
                </Link>
                <Link
                  href="/corporate"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                  企業の方へ
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  お問い合わせ
                </Link>
                <Link
                  href="/sitemap"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  サイトマップ
                </Link>
                {isLoggedIn ? (
                  <>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-900 mb-1.5">
                        {isDeveloper ? (
                          <span className="flex items-center">
                            開発者 <Badge className="ml-2 bg-amber-200 text-amber-800">管理者</Badge>
                          </span>
                        ) : (
                          `${username} さん`
                        )}
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/account/favorites"
                      className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      お気に入り
                    </Link>

                    {(isAdmin || isDeveloper) && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="text-amber-700 hover:text-amber-800 transition-colors py-1.5 text-sm flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                          管理ダッシュボード
                        </Link>
                        <Link
                          href="/admin/tools"
                          className="text-amber-700 hover:text-amber-800 transition-colors py-1.5 text-sm flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                          ツール管理
                        </Link>
                      </>
                    )}

                    {isPremium ? (
                      <Link
                        href="/tools/premium-tool"
                        className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Crown className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                        プレミアムツール
                      </Link>
                    ) : (
                      <Link
                        href="/premium"
                        className="text-gray-700 hover:text-blue-600 transition-colors py-1.5 text-sm flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Crown className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        有料会員になる
                      </Link>
                    )}
                    <button
                      className="text-left text-red-600 hover:text-red-700 transition-colors py-1.5 text-sm flex items-center"
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1.5" />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        router.push("/signup")
                        setIsMenuOpen(false)
                      }}
                    >
                      新規登録
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        router.push("/login")
                        setIsMenuOpen(false)
                      }}
                    >
                      ログイン
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

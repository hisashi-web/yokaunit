"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Link from "next/link"

// サイトマップのデータ構造
interface SitemapCategory {
  title: string
  links: {
    title: string
    url: string
  }[]
}

const sitemapData: SitemapCategory[] = [
  {
    title: "メインページ",
    links: [
      { title: "ホーム", url: "/" },
      { title: "ツール一覧", url: "/tools" },
      { title: "有料会員プラン", url: "/premium" },
      { title: "企業の方へ", url: "/corporate" },
      { title: "お問い合わせ", url: "/contact" },
    ],
  },
  {
    title: "ツールカテゴリ",
    links: [
      { title: "メディアツール", url: "/tools?category=media" },
      { title: "ユーティリティ", url: "/tools?category=utility" },
      { title: "変換ツール", url: "/tools?category=converter" },
      { title: "計算ツール", url: "/tools?category=calculator" },
      { title: "ゲーム・エンターテイメント", url: "/tools?category=game" },
      { title: "健康・ライフスタイル", url: "/tools?category=health" },
      { title: "教育・学習", url: "/tools?category=education" },
      { title: "ビジネス", url: "/tools?category=business" },
    ],
  },
  {
    title: "人気ツール",
    links: [
      { title: "パスワード生成ツール", url: "/tools/password" },
      { title: "ポモドーロタイマー", url: "/tools/pomodoro" },
      { title: "画像リサイズツール", url: "/tools/image-resize" },
      { title: "PDFから画像への変換", url: "/tools/pdf-to-image" },
      { title: "マークダウンエディタ", url: "/tools/markdown" },
      { title: "カラーパレット生成", url: "/tools/color-palette" },
    ],
  },
  {
    title: "会員情報",
    links: [
      { title: "ログイン", url: "/login" },
      { title: "新規登録", url: "/signup" },
      { title: "マイページ", url: "/account" },
      { title: "お気に入り", url: "/account/favorites" },
    ],
  },
  {
    title: "サポート・情報",
    links: [
      { title: "よくある質問", url: "/faq" },
      { title: "お問い合わせ", url: "/contact" },
      { title: "プライバシーポリシー", url: "/privacy-policy" },
      { title: "利用規約", url: "/terms" },
      { title: "サイトマップ", url: "/sitemap" },
    ],
  },
]

export default function SitemapClientPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "サイトマップ", href: "/sitemap" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">サイトマップ</h1>
            <p className="text-gray-600 mb-8">
              YokaUnitの全ページの一覧です。お探しのページが見つからない場合は、こちらからアクセスできます。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sitemapData.map((category, index) => (
                <div key={index}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">{category.title}</h2>
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.url}
                          className="text-blue-600 hover:underline"
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

import type { Metadata } from "next"
import SitemapClientPage from "./SitemapClientPage"

export const metadata: Metadata = {
  title: "サイトマップ | YokaUnit",
  description: "YokaUnitのサイトマップです。当サイトの全ページの一覧をご確認いただけます。",
}

export default function SitemapPage() {
  return <SitemapClientPage />
}

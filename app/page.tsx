import { ToolsShowcase } from "@/components/tools-showcase"
import { HeroSection } from "@/components/hero-section"
import { BackgroundAnimation } from "@/components/background-animation" // 新しいインポート
import { CurrentlyBuilding } from "@/components/currently-building"
import { SocialRequestBanner } from "@/components/social-request-banner"
import { AdminMessage } from "@/components/admin-message"
import { CorporateSection } from "@/components/corporate-section"
import { MembershipSection } from "@/components/membership-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollToTop } from "@/components/scroll-to-top" // 新しいインポート

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 relative overflow-hidden">
        {" "}
        {/* overflow-hiddenを追加 */}
        <BackgroundAnimation /> {/* 背景アニメーションを追加 */}
        <HeroSection />
        <div className="container mx-auto px-4 py-6">
          <SocialRequestBanner />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <CurrentlyBuilding />
              <ToolsShowcase />
            </div>
            <div className="space-y-4">
              <AdminMessage />
              <CorporateSection />
              <MembershipSection />
            </div>
          </div>
        </div>
      </main>
      <ScrollToTop /> {/* スクロールトップボタンを追加 */}
      <SiteFooter />
    </div>
  )
}

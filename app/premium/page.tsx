import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PremiumPlans } from "@/components/premium-plans"
import { Check } from "lucide-react"

export default function PremiumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">有料会員プラン</h1>
            <p className="text-gray-600 text-center mb-6">より高度なツールと特別な機能へのアクセスを手に入れましょう</p>

            <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-lg p-3 mb-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">有料会員の特典</h2>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-xs">プレミアムツール</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">有料会員限定の高度なツール</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-xs">広告非表示</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">すべてのページで広告が表示されません</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-xs">優先サポート</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">質問や要望に優先的に対応</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-xs">要望の優先開発</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">あなたのツール要望を優先的に開発</p>
                  </div>
                </div>
              </div>
            </div>

            <PremiumPlans />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CorporateForm } from "@/components/corporate-form"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Briefcase, Settings } from "lucide-react"

export default function CorporatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "企業の方へ", href: "/corporate" },
            ]}
          />

          <div className="max-w-3xl mx-auto mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">企業の方へ</h1>

            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="services">サービス概要</TabsTrigger>
                <TabsTrigger value="contact">お問い合わせ</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <Card className="p-4 mb-4 bg-blue-50 border border-blue-100">
                  <h2 className="text-base font-semibold text-blue-900 mb-2">YokaUnitの企業向けサービス</h2>
                  <p className="text-xs text-gray-700 mb-3">
                    YokaUnitでは、企業様向けに特別なサービスをご用意しています。機密保持契約（NDA）対応、パスワード付き限定公開ページ、
                    御社専用カスタマイズなど、ビジネスニーズに合わせた柔軟なソリューションを提供します。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded border border-blue-100 flex items-start">
                      <Shield className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800 text-xs">機密保持対応</h3>
                        <p className="text-[10px] text-gray-600">NDA締結のもと、機密情報を安全に扱います。</p>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100 flex items-start">
                      <Briefcase className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800 text-xs">限定公開ページ</h3>
                        <p className="text-[10px] text-gray-600">パスワード保護された専用ページをご提供します。</p>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100 flex items-start">
                      <Settings className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-blue-800 text-xs">カスタマイズ対応</h3>
                        <p className="text-[10px] text-gray-600">御社のニーズに合わせたツール開発が可能です。</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Card className="p-3">
                    <h3 className="text-sm font-semibold mb-1">企業向けプラン</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      複数ユーザーでの利用や、高度なカスタマイズが可能な企業向けプランをご用意しています。
                    </p>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        複数ユーザーアカウント
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        管理者ダッシュボード
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        利用状況レポート
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-3">
                    <h3 className="text-sm font-semibold mb-1">カスタム開発</h3>
                    <p className="text-xs text-gray-600 mb-2">御社の業務に最適化したツールの開発も承っております。</p>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        要件定義から開発まで
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        既存システムとの連携
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        保守・運用サポート
                      </li>
                    </ul>
                  </Card>
                </div>

                <p className="text-xs text-gray-700 mb-2">
                  以下のフォームからお問い合わせいただくと、担当者より詳細なご案内をさせていただきます。
                </p>
              </TabsContent>

              <TabsContent value="contact">
                <CorporateForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PremiumPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (plan: string) => {
    setIsLoading(true)

    try {
      // 実際のアプリではここで決済処理を行います
      // デモ用にローカルストレージに保存
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("isPremium", "true")

      // 成功したら遅延してリダイレクト
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/")
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // プラン情報を定義
  const plans = [
    {
      name: "ベーシック",
      description: "個人利用に最適",
      monthlyPrice: "¥500",
      quarterlyPrice: "¥1,350",
      yearlyPrice: "¥4,800",
      features: ["プレミアムツールへのアクセス", "広告非表示", "メールサポート"],
      popular: false,
      color: "blue-100",
    },
    {
      name: "プロ",
      description: "ビジネス利用に最適",
      monthlyPrice: "¥1,200",
      quarterlyPrice: "¥3,240",
      yearlyPrice: "¥11,520",
      features: ["ベーシックプランのすべての機能", "高度なプレミアムツール", "優先サポート", "要望の優先開発"],
      popular: true,
      color: "blue-200",
    },
    {
      name: "エンタープライズ",
      description: "大規模組織向け",
      monthlyPrice: "¥3,000",
      quarterlyPrice: "¥8,100",
      yearlyPrice: "¥28,800",
      features: ["プロプランのすべての機能", "カスタムツール開発", "専任サポート担当者", "複数ユーザーアカウント"],
      popular: false,
      color: "blue-100",
    },
  ]

  // 選択された課金サイクルに基づいて価格を取得
  const getPrice = (plan) => {
    switch (billingCycle) {
      case "monthly":
        return plan.monthlyPrice
      case "quarterly":
        return plan.quarterlyPrice
      case "yearly":
        return plan.yearlyPrice
      default:
        return plan.monthlyPrice
    }
  }

  // 選択された課金サイクルに基づいて期間を取得
  const getPeriod = () => {
    switch (billingCycle) {
      case "monthly":
        return "月"
      case "quarterly":
        return "3ヶ月"
      case "yearly":
        return "年"
      default:
        return "月"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Tabs defaultValue="monthly" className="w-full max-w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")} className="px-2 py-1 text-xs">
              月払い
            </TabsTrigger>
            <TabsTrigger
              value="quarterly"
              onClick={() => setBillingCycle("quarterly")}
              className="px-2 py-1 text-xs relative"
            >
              3ヶ月
              <span className="absolute -top-2 -right-2 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700">
                10%OFF
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              onClick={() => setBillingCycle("yearly")}
              className="px-2 py-1 text-xs relative"
            >
              年払い
              <span className="absolute -top-2 -right-2 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700">
                20%OFF
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* モバイル表示 */}
      <div className="md:hidden">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`border-${plan.color} mb-3 ${plan.popular ? "bg-gradient-to-b from-blue-50 to-white relative" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                人気
              </div>
            )}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold text-base">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{getPrice(plan)}</div>
                  <div className="text-xs text-gray-500">/{getPeriod()}</div>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-xs">
                    <Check className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full text-sm py-1 h-8 ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "登録する"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`border-${plan.color} ${plan.popular ? "bg-gradient-to-b from-blue-50 to-white relative" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                人気
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold">{getPrice(plan)}</span>
                <span className="text-gray-500 ml-1 text-sm">/{getPeriod()}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "登録する"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 mt-4">
        <p>すべてのプランは、いつでもキャンセル可能です。</p>
        <p className="mt-1">
          ご不明な点は
          <a href="/contact" className="text-blue-600 hover:underline">
            お問い合わせ
          </a>
          ください。
        </p>
      </div>
    </div>
  )
}

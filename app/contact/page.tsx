"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Mail, Phone, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [inquiryType, setInquiryType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 実際のアプリではここでフォーム送信APIを呼び出します
      // 送信成功を模擬
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      toast({
        title: "お問い合わせを送信しました",
        description: "内容を確認次第、担当者よりご連絡いたします。",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "エラーが発生しました",
        description: "お問い合わせの送信に失敗しました。後ほど再度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "お問い合わせ", href: "/contact" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">お問い合わせ</h1>

            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="form">お問い合わせフォーム</TabsTrigger>
                <TabsTrigger value="info">連絡先情報</TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                {isSubmitted ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-center text-green-600 text-lg">
                        お問い合わせありがとうございます
                      </CardTitle>
                      <CardDescription className="text-center">
                        内容を確認次第、担当者よりご連絡いたします
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-700">
                          お問い合わせいただき、ありがとうございます。内容を確認次第、担当者より2営業日以内にご連絡いたします。
                        </p>
                        <Button onClick={() => router.push("/")} className="mt-4">
                          ホームに戻る
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">お問い合わせフォーム</CardTitle>
                      <CardDescription className="text-xs">
                        以下のフォームに必要事項をご入力の上、送信ボタンをクリックしてください。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-xs">
                              お名前 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              placeholder="山田 太郎"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="h-8 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs">
                              メールアドレス <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="inquiry-type" className="text-xs">
                            お問い合わせ種類
                          </Label>
                          <Select value={inquiryType} onValueChange={setInquiryType}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="お問い合わせの種類を選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">一般的なお問い合わせ</SelectItem>
                              <SelectItem value="tool-request">ツールのリクエスト</SelectItem>
                              <SelectItem value="bug-report">不具合の報告</SelectItem>
                              <SelectItem value="premium">有料会員について</SelectItem>
                              <SelectItem value="corporate">企業向けサービスについて</SelectItem>
                              <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="subject" className="text-xs">
                            件名 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="subject"
                            placeholder="お問い合わせの件名"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="h-8 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="message" className="text-xs">
                            お問い合わせ内容 <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="お問い合わせ内容を入力してください"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px] text-sm"
                            required
                          />
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="privacy" required className="mt-1" />
                          <label
                            htmlFor="privacy"
                            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <a href="/privacy-policy" className="text-blue-600 hover:underline">
                              プライバシーポリシー
                            </a>
                            に同意します
                          </label>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button type="submit" disabled={isLoading} className="h-8 text-sm">
                            {isLoading ? "送信中..." : "送信する"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="info">
                <div className="space-y-3">
                  <Card>
                    <CardContent className="p-3 flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">お問い合わせフォーム</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          フォームからお気軽にお問い合わせください。通常2営業日以内に返信いたします。
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">メールでのお問い合わせ</h3>
                        <p className="text-xs text-gray-600 mt-1">info@yokaunit.com</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3 flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">お電話でのお問い合わせ</h3>
                        <p className="text-xs text-gray-600 mt-1">03-1234-5678（平日 10:00-18:00）</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => router.push("/corporate")}
                    >
                      企業の方はこちら <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

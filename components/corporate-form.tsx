"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function CorporateForm() {
  const [companyName, setCompanyName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [department, setDepartment] = useState("")
  const [inquiry, setInquiry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">企業向けお問い合わせ</CardTitle>
        <CardDescription className="text-xs">
          以下のフォームに必要事項をご入力の上、送信ボタンをクリックしてください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center py-4">
            <h3 className="text-green-600 font-medium mb-2">お問い合わせありがとうございます</h3>
            <p className="text-sm text-gray-600">内容を確認次第、担当者より1営業日以内にご連絡いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="company-name" className="text-xs">
                  会社名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company-name"
                  placeholder="株式会社サンプル"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="department" className="text-xs">
                  部署名
                </Label>
                <Input
                  id="department"
                  placeholder="営業部"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="contact-name" className="text-xs">
                  担当者名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-name"
                  placeholder="山田 太郎"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
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
              <Label htmlFor="phone" className="text-xs">
                電話番号
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="03-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inquiry-type" className="text-xs">
                お問い合わせ内容
              </Label>
              <Select>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="お問い合わせの種類を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">サービス内容について</SelectItem>
                  <SelectItem value="price">料金プランについて</SelectItem>
                  <SelectItem value="custom">カスタム開発について</SelectItem>
                  <SelectItem value="demo">デモのリクエスト</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="inquiry" className="text-xs">
                お問い合わせ詳細 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="inquiry"
                placeholder="お問い合わせ内容を入力してください"
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                className="min-h-[80px] text-sm"
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
          </form>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="flex justify-end pt-0">
          <Button onClick={handleSubmit} disabled={isLoading} className="h-8 text-sm">
            {isLoading ? "送信中..." : "送信する"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

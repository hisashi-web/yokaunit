"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface AdditionalInfoFormProps {
  userId: string
  email: string
  fullName: string
}

export function AdditionalInfoForm({ userId, email, fullName }: AdditionalInfoFormProps) {
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!username || !phoneNumber || !birthDate) {
      setError("すべての項目を入力してください")
      setIsLoading(false)
      return
    }

    // 電話番号からハイフンを削除
    const cleanPhoneNumber = phoneNumber.replace(/-/g, "")

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username,
          phone_number: cleanPhoneNumber,
          birth_date: birthDate,
        })
        .eq("id", userId)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "登録完了",
        description: "プロフィール情報が更新されました",
      })

      router.push("/")
      router.refresh()
    } catch (err: any) {
      console.error("プロフィール更新エラー:", err)
      if (err.message?.includes("username")) {
        setError("このユーザー名は既に使用されています")
      } else {
        setError(err.message || "更新中にエラーが発生しました")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">追加情報の入力</CardTitle>
        <CardDescription className="text-center">
          アカウント設定を完了するために、追加情報を入力してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">氏名</Label>
            <Input id="fullName" value={fullName} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              ユーザー名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              placeholder="username123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              電話番号 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="09012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">
              生年月日 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().split("T")[0]}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "更新中..." : "登録完了"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

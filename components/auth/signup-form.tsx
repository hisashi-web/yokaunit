"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

const REDIRECT_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  : "http://localhost:3000/auth/callback"

export function SignupForm() {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // バリデーション
    if (!username || !fullName || !email || !phoneNumber || !birthDate || !password) {
      setError("すべての必須項目を入力してください")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("利用規約とプライバシーポリシーに同意してください")
      setIsLoading(false)
      return
    }

    // 電話番号からハイフンを削除
    const cleanPhoneNumber = phoneNumber.replace(/-/g, "")

    try {
      // Supabaseで新規ユーザー登録
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            phone_number: cleanPhoneNumber,
            birth_date: birthDate,
          },
          emailRedirectTo: REDIRECT_URL,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "登録完了",
          description: "確認メールを送信しました。メールをご確認ください。",
        })
        router.push("/auth/confirm")
      } else if (data.user) {
        // メール確認が不要な場合（開発環境など）
        toast({
          title: "登録完了",
          description: "アカウントが作成されました。",
        })
        router.push("/")
      }
    } catch (err: any) {
      console.error("登録エラー:", err)
      if (err.message === "User already registered") {
        setError("このメールアドレスは既に登録されています")
      } else if (err.message?.includes("username")) {
        setError("このユーザー名は既に使用されています")
      } else {
        setError(err.message || "登録中にエラーが発生しました")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: REDIRECT_URL,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      console.error("Googleログインエラー:", err)
      setError(err.message || "Googleログイン中にエラーが発生しました")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">新規登録</CardTitle>
        <CardDescription className="text-center">アカウントを作成して、すべての機能を利用しましょう</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline" type="button" onClick={handleGoogleSignup} disabled={isLoading} className="w-full">
            <FcGoogle className="mr-2 h-5 w-5" />
            Googleで登録
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="fullName">
                氏名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="山田 太郎"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              メールアドレス <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <p className="text-xs text-gray-500">ハイフンなしで入力してください</p>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              パスワード <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500">6文字以上で入力してください</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              パスワード（確認） <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm">
              <span>
                <Link href="/terms" className="text-blue-600 hover:underline">
                  利用規約
                </Link>{" "}
                と{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  プライバシーポリシー
                </Link>
                に同意します
              </span>
            </label>
          </div>

          {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "登録中..." : "アカウント作成"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            ログイン
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

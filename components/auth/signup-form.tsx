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

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // 簡易的な検証（デモ用）
      if (!name || !email || !password) {
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

      // ローカルストレージに保存（デモ用）
      localStorage.setItem("username", name)
      localStorage.setItem("email", email)
      localStorage.setItem("password", password)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("isPremium", "false")

      // ストレージイベントを発火して他のコンポーネントに通知
      window.dispatchEvent(new Event("storage"))

      toast({
        title: "アカウント作成成功",
        description: `${name}さん、YokaUnitへようこそ！`,
      })

      // リダイレクト
      router.push("/")
    } catch (err) {
      console.error("Signup error:", err)
      setError("登録中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true)

    // デモ用の簡易ソーシャルログイン
    setTimeout(() => {
      const username = `user_${Math.floor(Math.random() * 1000)}`
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
      localStorage.setItem("email", `${username}@example.com`)

      // ストレージイベントを発火して他のコンポーネントに通知
      window.dispatchEvent(new Event("storage"))

      toast({
        title: `${provider}で登録成功`,
        description: `${username}さん、YokaUnitへようこそ！`,
      })

      router.push("/")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">アカウント作成</CardTitle>
        <CardDescription className="text-center">以下の情報を入力して、アカウントを作成しましょう</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            type="button"
            className="bg-white"
            onClick={() => handleSocialSignup("Google")}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Googleで登録
          </Button>
          <Button
            variant="outline"
            type="button"
            className="bg-white"
            onClick={() => handleSocialSignup("LINE")}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#06C755">
              <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-.143-.176-.143h-2.793c-.29 0-.568-.09-.769-.33-.201-.24-.201-.6-.201-.8V8.02c0-.26.016-.52.201-.76.186-.24.479-.33.769-.33h7.14c.314 0 .615.09.802.33.186.24.201.51.201.76v6.105c0 .58-.186 1.05-.513 1.42-.329.36-.72.58-1.163.58" />
              <path d="M12 2C6.5 2 2 5.75 2 10.38c0 4.01 3.56 7.37 8.36 7.99.32.08.78.21.89.54.1.31.07.78.03 1.09 0 0-.12.72-.2 1.08-.07.37-.32 1.45.31 1.56.64.11 1.21-.42 1.87-1.08 1.13-1.13 2.06-2.05 3.09-3.08 2.09-2.09 4.65-4.31 4.65-8.1C21 5.75 16.5 2 12 2" />
            </svg>
            LINEで登録
          </Button>
          <Button
            variant="outline"
            type="button"
            className="bg-white"
            onClick={() => handleSocialSignup("Apple")}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
            </svg>
            Appleで登録
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                お名前 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                required
              />
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
                required
              />
              <p className="text-xs text-gray-500">6文字以上で、英字・数字を含めてください</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                パスワード（確認） <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <span>
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    利用規約
                  </Link>{" "}
                  と{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "アカウント作成"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちの場合は{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

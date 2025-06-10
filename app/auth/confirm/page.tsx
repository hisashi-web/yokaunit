import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="mt-6 text-2xl font-bold">メールを確認してください</CardTitle>
            <CardDescription>
              確認メールを送信しました。メールに記載されたリンクをクリックして、アカウントを有効化してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>メールが届かない場合は、以下をご確認ください：</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>迷惑メールフォルダをご確認ください</li>
                <li>メールアドレスが正しく入力されているかご確認ください</li>
                <li>数分お待ちいただいてから再度ご確認ください</li>
              </ul>
            </div>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/login">ログインページに戻る</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">ホームページに戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

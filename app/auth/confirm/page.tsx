import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">メールを確認してください</CardTitle>
          <CardDescription>
            登録したメールアドレスに確認メールを送信しました。
            メール内のリンクをクリックしてアカウントを有効化してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>メールが届かない場合は、以下をご確認ください：</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>迷惑メールフォルダをご確認ください</li>
              <li>メールアドレスが正しく入力されているかご確認ください</li>
              <li>しばらく時間をおいてから再度ご確認ください</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">ログインページに戻る</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">ホームページに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

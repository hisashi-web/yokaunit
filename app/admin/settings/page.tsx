"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Settings, Save, RefreshCw, Shield, Mail, Database, Sliders } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeveloper, setIsDeveloper] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)

    // 開発者権限の確認
    const checkAuth = () => {
      const developer = localStorage.getItem("isDeveloper") === "true"
      setIsDeveloper(developer)
      setIsLoading(false)

      // 開発者でない場合はホームにリダイレクト
      if (!developer) {
        router.push("/")
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    // 設定保存の処理（実際のアプリではAPIリクエストなど）
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "設定を保存しました",
      description: "システム設定が正常に更新されました。",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>読み込み中...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!isDeveloper) {
    return null // リダイレクト中
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "開発者ダッシュボード", href: "/admin/dashboard" },
              { label: "システム設定", href: "/admin/settings" },
            ]}
          />

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <AdminSidebar activePage="settings" />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-amber-800 mb-2">システム設定</h1>
                <p className="text-amber-700">
                  YokaUnitのシステム設定を管理します。一般設定、セキュリティ、メール、バックアップなどの設定が可能です。
                </p>
              </div>

              <div className="flex justify-end mb-4">
                <Button
                  className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>{isSaving ? "保存中..." : "すべての設定を保存"}</span>
                </Button>
              </div>

              <Tabs defaultValue="general" className="mb-6">
                <TabsList className="bg-amber-100 text-amber-700 mb-4">
                  <TabsTrigger value="general" className="data-[state=active]:bg-white">
                    一般
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-white">
                    セキュリティ
                  </TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-white">
                    メール
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="data-[state=active]:bg-white">
                    バックアップ
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="data-[state=active]:bg-white">
                    高度な設定
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-amber-600" />
                        一般設定
                      </CardTitle>
                      <CardDescription>サイトの基本設定を管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="site-name">サイト名</Label>
                          <Input id="site-name" defaultValue="YokaUnit" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="site-description">サイトの説明</Label>
                          <Textarea
                            id="site-description"
                            defaultValue="ユーザーの「あったらいいな」を実現するツール・ページ作成プラットフォーム"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="site-url">サイトURL</Label>
                          <Input id="site-url" defaultValue="https://yokaunit.com" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admin-email">管理者メールアドレス</Label>
                          <Input id="admin-email" defaultValue="admin@yokaunit.com" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">タイムゾーン</Label>
                          <Select defaultValue="Asia/Tokyo">
                            <SelectTrigger id="timezone">
                              <SelectValue placeholder="タイムゾーンを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9:00)</SelectItem>
                              <SelectItem value="America/New_York">America/New_York (GMT-5:00)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT+0:00)</SelectItem>
                              <SelectItem value="Australia/Sydney">Australia/Sydney (GMT+11:00)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date-format">日付フォーマット</Label>
                          <Select defaultValue="Y-m-d">
                            <SelectTrigger id="date-format">
                              <SelectValue placeholder="日付フォーマットを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y-m-d">YYYY-MM-DD (2023-12-25)</SelectItem>
                              <SelectItem value="m/d/Y">MM/DD/YYYY (12/25/2023)</SelectItem>
                              <SelectItem value="d/m/Y">DD/MM/YYYY (25/12/2023)</SelectItem>
                              <SelectItem value="Y年m月d日">YYYY年MM月DD日 (2023年12月25日)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="maintenance-mode">メンテナンスモード</Label>
                            <p className="text-sm text-gray-500">
                              有効にすると、一般ユーザーはサイトにアクセスできなくなります
                            </p>
                          </div>
                          <Switch id="maintenance-mode" />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="google-analytics">Google Analyticsトラッキングコード</Label>
                          <Textarea id="google-analytics" placeholder="G-XXXXXXXXXX" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="custom-css">カスタムCSS</Label>
                          <Textarea id="custom-css" placeholder="/* カスタムCSSをここに入力 */" className="font-mono" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="custom-js">カスタムJavaScript</Label>
                          <Textarea
                            id="custom-js"
                            placeholder="// カスタムJavaScriptをここに入力"
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-amber-600" />
                        セキュリティ設定
                      </CardTitle>
                      <CardDescription>サイトのセキュリティ設定を管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="force-ssl">SSL強制</Label>
                            <p className="text-sm text-gray-500">すべてのトラフィックをHTTPSにリダイレクト</p>
                          </div>
                          <Switch id="force-ssl" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="two-factor">二要素認証</Label>
                            <p className="text-sm text-gray-500">管理者アカウントに二要素認証を要求</p>
                          </div>
                          <Switch id="two-factor" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="login-attempts">ログイン試行制限</Label>
                            <p className="text-sm text-gray-500">5回失敗したらアカウントをロック</p>
                          </div>
                          <Switch id="login-attempts" defaultChecked />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password-policy">パスワードポリシー</Label>
                          <Select defaultValue="strong">
                            <SelectTrigger id="password-policy">
                              <SelectValue placeholder="パスワードポリシーを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">基本 (最低6文字)</SelectItem>
                              <SelectItem value="medium">中 (最低8文字、数字を含む)</SelectItem>
                              <SelectItem value="strong">強 (最低10文字、大文字・小文字・数字・記号を含む)</SelectItem>
                              <SelectItem value="custom">カスタム</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session-timeout">セッションタイムアウト（分）</Label>
                          <Input id="session-timeout" type="number" defaultValue="30" min="1" />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="allowed-ips">許可IPアドレス（管理画面）</Label>
                          <Textarea id="allowed-ips" placeholder="IPアドレスを1行ずつ入力（空白の場合は制限なし）" />
                          <p className="text-xs text-gray-500">
                            管理画面へのアクセスを特定のIPアドレスに制限します。複数のIPアドレスは改行で区切ってください。
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>セキュリティヘッダー</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Content-Security-Policy</span>
                              <Switch id="csp-header" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">X-XSS-Protection</span>
                              <Switch id="xss-header" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">X-Frame-Options</span>
                              <Switch id="frame-header" defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="email">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-amber-600" />
                        メール設定
                      </CardTitle>
                      <CardDescription>メール送信の設定を管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="mail-from">送信元メールアドレス</Label>
                          <Input id="mail-from" defaultValue="noreply@yokaunit.com" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mail-name">送信者名</Label>
                          <Input id="mail-name" defaultValue="YokaUnit" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mail-driver">メール送信方法</Label>
                          <Select defaultValue="smtp">
                            <SelectTrigger id="mail-driver">
                              <SelectValue placeholder="メール送信方法を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="smtp">SMTP</SelectItem>
                              <SelectItem value="sendmail">Sendmail</SelectItem>
                              <SelectItem value="mailgun">Mailgun</SelectItem>
                              <SelectItem value="ses">Amazon SES</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">SMTP設定</h3>

                          <div className="space-y-2">
                            <Label htmlFor="smtp-host">SMTPホスト</Label>
                            <Input id="smtp-host" defaultValue="smtp.example.com" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="smtp-port">SMTPポート</Label>
                            <Input id="smtp-port" defaultValue="587" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="smtp-username">SMTPユーザー名</Label>
                            <Input id="smtp-username" defaultValue="user@example.com" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="smtp-password">SMTPパスワード</Label>
                            <Input id="smtp-password" type="password" defaultValue="password" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="smtp-encryption">暗号化</Label>
                              <p className="text-sm text-gray-500">TLS暗号化を使用</p>
                            </div>
                            <Switch id="smtp-encryption" defaultChecked />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">メールテンプレート</h3>

                          <div className="space-y-2">
                            <Label htmlFor="welcome-email">ウェルカムメール</Label>
                            <Textarea
                              id="welcome-email"
                              defaultValue="YokaUnitへようこそ！\n\nご登録ありがとうございます。"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password-reset">パスワードリセットメール</Label>
                            <Textarea
                              id="password-reset"
                              defaultValue="パスワードリセットのリクエストを受け付けました。\n\n以下のリンクからパスワードをリセットしてください。"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" className="mr-2">
                            テストメール送信
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="backup">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-amber-600" />
                        バックアップ設定
                      </CardTitle>
                      <CardDescription>データのバックアップと復元の設定を管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="auto-backup">自動バックアップ</Label>
                            <p className="text-sm text-gray-500">定期的にデータをバックアップ</p>
                          </div>
                          <Switch id="auto-backup" defaultChecked />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backup-frequency">バックアップ頻度</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger id="backup-frequency">
                              <SelectValue placeholder="バックアップ頻度を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">毎時</SelectItem>
                              <SelectItem value="daily">毎日</SelectItem>
                              <SelectItem value="weekly">毎週</SelectItem>
                              <SelectItem value="monthly">毎月</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backup-time">バックアップ時刻（毎日の場合）</Label>
                          <Input id="backup-time" type="time" defaultValue="03:00" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backup-retention">バックアップ保持期間（日数）</Label>
                          <Input id="backup-retention" type="number" defaultValue="30" min="1" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backup-storage">バックアップ保存先</Label>
                          <Select defaultValue="local">
                            <SelectTrigger id="backup-storage">
                              <SelectValue placeholder="バックアップ保存先を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">ローカルストレージ</SelectItem>
                              <SelectItem value="s3">Amazon S3</SelectItem>
                              <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                              <SelectItem value="dropbox">Dropbox</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Amazon S3設定</h3>

                          <div className="space-y-2">
                            <Label htmlFor="s3-bucket">S3バケット名</Label>
                            <Input id="s3-bucket" defaultValue="yokaunit-backups" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="s3-region">S3リージョン</Label>
                            <Input id="s3-region" defaultValue="ap-northeast-1" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="s3-access-key">アクセスキー</Label>
                            <Input id="s3-access-key" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="s3-secret-key">シークレットキー</Label>
                            <Input id="s3-secret-key" type="password" />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">今すぐバックアップ</Button>
                          <Button variant="outline">バックアップから復元</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced">
                  <Card className="bg-white border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sliders className="h-5 w-5 mr-2 text-amber-600" />
                        高度な設定
                      </CardTitle>
                      <CardDescription>システムの高度な設定を管理します。</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="debug-mode">デバッグモード</Label>
                            <p className="text-sm text-gray-500">詳細なエラー情報を表示</p>
                          </div>
                          <Switch id="debug-mode" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="cache-enabled">キャッシュ</Label>
                            <p className="text-sm text-gray-500">システムキャッシュを有効化</p>
                          </div>
                          <Switch id="cache-enabled" defaultChecked />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cache-driver">キャッシュドライバ</Label>
                          <Select defaultValue="file">
                            <SelectTrigger id="cache-driver">
                              <SelectValue placeholder="キャッシュドライバを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="file">ファイル</SelectItem>
                              <SelectItem value="redis">Redis</SelectItem>
                              <SelectItem value="memcached">Memcached</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="log-level">ログレベル</Label>
                          <Select defaultValue="error">
                            <SelectTrigger id="log-level">
                              <SelectValue placeholder="ログレベルを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="debug">デバッグ</SelectItem>
                              <SelectItem value="info">情報</SelectItem>
                              <SelectItem value="warning">警告</SelectItem>
                              <SelectItem value="error">エラー</SelectItem>
                              <SelectItem value="critical">重大</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="api-key">API キー</Label>
                          <div className="flex">
                            <Input
                              id="api-key"
                              defaultValue="sk_test_abcdefghijklmnopqrstuvwxyz"
                              readOnly
                              className="flex-1"
                            />
                            <Button variant="outline" className="ml-2">
                              再生成
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="api-enabled">API アクセス</Label>
                            <p className="text-sm text-gray-500">外部からのAPI利用を許可</p>
                          </div>
                          <Switch id="api-enabled" defaultChecked />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="cron-expression">CRONジョブ設定</Label>
                          <Input id="cron-expression" defaultValue="0 0 * * *" />
                          <p className="text-xs text-gray-500">
                            システムジョブのCRON式を設定します。デフォルトは毎日午前0時に実行。
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="system-path">システムパス</Label>
                          <Input id="system-path" defaultValue="/var/www/yokaunit" />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" className="text-red-600 hover:text-red-700">
                            キャッシュクリア
                          </Button>
                          <Button variant="outline">システム診断</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

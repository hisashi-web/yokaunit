import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { Breadcrumbs } from "@/components/breadcrumbs"
import type { Metadata } from "next"
import { RelatedTools } from "@/components/related-tools"

// SEO最適化のためのメタデータ
export const metadata: Metadata = {
  title: "安全なパスワード生成ツール | 無料で簡単に強力なパスワードを作成 | YokaUnit",
  description:
    "YokaUnitの無料パスワード生成ツールで、安全で強力なパスワードを簡単に作成できます。文字数、記号、数字などの条件をカスタマイズして、あなたに最適なパスワードを生成しましょう。",
  keywords: [
    "パスワード生成",
    "パスワード作成",
    "強力なパスワード",
    "安全なパスワード",
    "無料パスワードジェネレーター",
    "パスワード強度",
    "ランダムパスワード",
  ],
  openGraph: {
    title: "安全なパスワード生成ツール | 無料で簡単に強力なパスワードを作成",
    description:
      "YokaUnitの無料パスワード生成ツールで、安全で強力なパスワードを簡単に作成できます。文字数、記号、数字などの条件をカスタマイズして、あなたに最適なパスワードを生成しましょう。",
    url: "https://yokaunit.com/tools/password",
    type: "website",
  },
}

// パスワード生成ツールページ
export default function PasswordGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "ツール一覧", href: "/tools" },
              { label: "パスワード生成ツール", href: "/tools/password" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">パスワード生成ツール</h1>
            <p className="text-gray-600 mb-6">
              安全で強力なパスワードを簡単に生成できます。文字数や使用する文字の種類をカスタマイズして、あなたに最適なパスワードを作成しましょう。
            </p>

            <PasswordGenerator />

            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">安全なパスワードの重要性</h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  インターネット上のアカウントを保護するために、強力なパスワードを使用することは非常に重要です。弱いパスワードや複数のサービスで同じパスワードを使い回すことは、セキュリティリスクを高めます。
                </p>
                <h3>強力なパスワードの特徴</h3>
                <ul>
                  <li>
                    <strong>十分な長さ</strong>: 最低でも12文字以上が推奨されています。
                  </li>
                  <li>
                    <strong>複雑性</strong>:
                    大文字、小文字、数字、特殊記号を組み合わせることで、パスワードの強度が向上します。
                  </li>
                  <li>
                    <strong>予測不可能性</strong>: 誕生日や名前など、個人情報に基づくパスワードは避けましょう。
                  </li>
                  <li>
                    <strong>一意性</strong>: 異なるサービスごとに異なるパスワードを使用することが重要です。
                  </li>
                </ul>

                <h3>パスワード管理のベストプラクティス</h3>
                <p>
                  多数の強力なパスワードを覚えておくことは困難です。そのため、以下の方法でパスワードを安全に管理することをお勧めします：
                </p>
                <ul>
                  <li>
                    <strong>パスワードマネージャーの使用</strong>:
                    パスワードマネージャーを使用すると、1つのマスターパスワードだけを覚えておけば、他のすべてのパスワードを安全に保存できます。
                  </li>
                  <li>
                    <strong>二要素認証の有効化</strong>:
                    可能な限り、二要素認証を有効にして、パスワードだけでなく、別の認証方法も必要とするようにしましょう。
                  </li>
                  <li>
                    <strong>定期的なパスワード変更</strong>:
                    重要なアカウントのパスワードは定期的に変更することをお勧めします。
                  </li>
                </ul>

                <h3>このツールの使い方</h3>
                <p>当ツールを使用して、安全で強力なパスワードを簡単に生成できます。以下の手順に従ってください：</p>
                <ol>
                  <li>パスワードの長さを選択します（12文字以上を推奨）。</li>
                  <li>
                    含める文字の種類（大文字、小文字、数字、記号）を選択します。セキュリティを高めるために、すべての種類を含めることをお勧めします。
                  </li>
                  <li>「パスワードを生成」ボタンをクリックします。</li>
                  <li>生成されたパスワードをコピーして使用します。</li>
                </ol>

                <p>
                  <strong>注意</strong>:
                  このツールで生成されたパスワードはお使いのブラウザ内で作成され、サーバーには送信されません。完全にプライバシーが保護された状態でご利用いただけます。
                </p>
              </div>
            </div>

            <RelatedTools
              currentToolId="password"
              category="セキュリティ"
              tools={[
                {
                  id: "encryption",
                  name: "テキスト暗号化ツール",
                  description: "テキストメッセージを暗号化して安全に共有できます。",
                  url: "/tools/encryption",
                },
                {
                  id: "password-strength",
                  name: "パスワード強度チェッカー",
                  description: "既存のパスワードの強度を評価し、改善点を提案します。",
                  url: "/tools/password-strength",
                },
                {
                  id: "hash-generator",
                  name: "ハッシュ生成ツール",
                  description: "MD5、SHA-1、SHA-256などのハッシュを生成します。",
                  url: "/tools/hash-generator",
                },
              ]}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

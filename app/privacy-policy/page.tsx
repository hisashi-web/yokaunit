import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "プライバシーポリシー | YokaUnit",
  description:
    "YokaUnitのプライバシーポリシーについてご説明します。ユーザー情報の取り扱いや保護方針についてご確認いただけます。",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: "ホーム", href: "/" },
              { label: "プライバシーポリシー", href: "/privacy-policy" },
            ]}
          />

          <div className="max-w-4xl mx-auto mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">プライバシーポリシー</h1>

            <div className="prose max-w-none">
              <p>
                YokaUnit（以下、「当サイト」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーでは、当サイトがどのような情報を収集し、どのように利用・保護するかについて説明します。
              </p>

              <h2>1. 収集する情報</h2>
              <p>当サイトでは、以下の情報を収集することがあります：</p>
              <ul>
                <li>
                  <strong>アカウント情報</strong>
                  ：ユーザー登録時に提供いただく氏名、メールアドレス、パスワードなどの情報
                </li>
                <li>
                  <strong>利用情報</strong>：当サイトの利用状況、アクセスしたページ、利用したツールなどの情報
                </li>
                <li>
                  <strong>デバイス情報</strong>：IPアドレス、ブラウザの種類、デバイスの種類などの技術的情報
                </li>
                <li>
                  <strong>Cookie情報</strong>：当サイトの利用状況を追跡するためのCookie情報
                </li>
              </ul>

              <h2>2. 情報の利用目的</h2>
              <p>収集した情報は、以下の目的で利用します：</p>
              <ul>
                <li>当サイトのサービス提供・維持・改善</li>
                <li>ユーザーアカウントの管理</li>
                <li>ユーザーサポートの提供</li>
                <li>サービスの利用状況の分析</li>
                <li>新機能やサービスの開発</li>
                <li>不正アクセスや不正利用の防止</li>
              </ul>

              <h2>3. 情報の共有</h2>
              <p>当サイトは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：</p>
              <ul>
                <li>ユーザーの同意がある場合</li>
                <li>法律上の要請や規制に従う必要がある場合</li>
                <li>当サイトの権利や財産を保護する必要がある場合</li>
                <li>サービス提供に必要なパートナー企業（情報は必要最小限に制限されます）</li>
              </ul>

              <h2>4. 情報の保護</h2>
              <p>
                当サイトは、収集した情報を保護するために適切な技術的・組織的措置を講じています。ただし、インターネット上での完全なセキュリティを保証することはできません。
              </p>

              <h2>5. Cookieの使用</h2>
              <p>
                当サイトでは、ユーザー体験の向上やサイト利用状況の分析のためにCookieを使用しています。ブラウザの設定でCookieを無効にすることも可能ですが、一部の機能が正常に動作しなくなる可能性があります。
              </p>

              <h2>6. ユーザーの権利</h2>
              <p>ユーザーには以下の権利があります：</p>
              <ul>
                <li>個人情報へのアクセス、修正、削除を要求する権利</li>
                <li>個人情報の処理に対する同意を撤回する権利</li>
                <li>個人情報の処理に関する苦情を申し立てる権利</li>
              </ul>

              <h2>7. 子どものプライバシー</h2>
              <p>
                当サイトは、13歳未満の子どもから意図的に個人情報を収集することはありません。13歳未満の子どもの個人情報が当サイトに提供されたことが判明した場合、速やかに削除します。
              </p>

              <h2>8. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。重要な変更がある場合は、サイト上での通知やメールでお知らせします。
              </p>

              <h2>9. お問い合わせ</h2>
              <p>
                本プライバシーポリシーに関するご質問やご意見は、以下の連絡先までお寄せください：
                <br />
                メール：info@yokaunit.com
              </p>

              <p className="text-sm text-gray-500 mt-8">最終更新日：2023年12月25日</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

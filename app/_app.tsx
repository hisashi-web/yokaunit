"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import Script from "next/script"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      // アナリティクスにページ遷移を送信
      window.gtag?.("config", "G-S0XFNHDJQS", {
        page_path: url,
      })

      // ページ遷移時にトップにスクロール
      window.scrollTo(0, 0)
    }

    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      {/* Googleタグマネージャーのスクリプト */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-S0XFNHDJQS"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S0XFNHDJQS');
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

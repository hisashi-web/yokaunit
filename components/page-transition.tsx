"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function PageTransition() {
  const pathname = usePathname()

  useEffect(() => {
    // ページ遷移時にトップにスクロール
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

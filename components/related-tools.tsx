"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface RelatedTool {
  id: string
  name: string
  description: string
  url: string
}

interface RelatedToolsProps {
  currentToolId: string
  category: string
  tools: RelatedTool[]
}

export function RelatedTools({ currentToolId, category, tools }: RelatedToolsProps) {
  // 現在のツールを除外
  const filteredTools = tools.filter((tool) => tool.id !== currentToolId)

  if (filteredTools.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">関連ツール</h2>
      <p className="text-gray-600 mb-4">
        {category}カテゴリの他のツールもチェックしてみてください。あなたのニーズに合ったツールが見つかるかもしれません。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <Link key={tool.id} href={tool.url} onClick={() => window.scrollTo(0, 0)}>
            <Card className="h-full hover:shadow-md transition-shadow duration-200 hover:border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                <div className="flex items-center text-blue-600 text-sm">
                  詳細を見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

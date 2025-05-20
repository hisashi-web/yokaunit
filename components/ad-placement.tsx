import { Card, CardContent } from "@/components/ui/card"

interface AdPlacementProps {
  position: "top" | "sidebar" | "content"
}

export function AdPlacement({ position }: AdPlacementProps) {
  // 広告の位置によってサイズやスタイルを変更
  const getAdStyle = () => {
    switch (position) {
      case "top":
        return "h-24 md:h-28 mb-8 bg-gray-100"
      case "sidebar":
        return "h-64 bg-gray-100"
      case "content":
        return "h-20 my-8 bg-gray-100"
      default:
        return "h-24 bg-gray-100"
    }
  }

  return (
    <div className={`w-full ${getAdStyle()} rounded-lg overflow-hidden`}>
      <Card className="h-full border-dashed border-gray-300 bg-transparent">
        <CardContent className="flex items-center justify-center h-full p-4">
          <div className="text-center text-gray-400">
            <p className="text-sm">広告エリア</p>
            <p className="text-xs">{position === "top" ? "728×90" : position === "sidebar" ? "300×600" : "468×60"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

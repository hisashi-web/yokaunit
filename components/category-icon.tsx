import {
  ImageIcon,
  FileText,
  Calculator,
  Gamepad2,
  Book,
  Heart,
  FileCode,
  BarChart3,
  Palette,
  FileType,
  Settings,
} from "lucide-react"

interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className = "h-4 w-4" }: CategoryIconProps) {
  switch (category) {
    case "画像・メディア":
      return <ImageIcon className={className} />
    case "テキスト処理":
      return <FileText className={className} />
    case "計算ツール":
      return <Calculator className={className} />
    case "ゲーム":
      return <Gamepad2 className={className} />
    case "学習・教育":
      return <Book className={className} />
    case "健康・生活":
      return <Heart className={className} />
    case "開発者向け":
      return <FileCode className={className} />
    case "ビジネス":
      return <BarChart3 className={className} />
    case "デザイン":
      return <Palette className={className} />
    case "ファイル変換":
      return <FileType className={className} />
    case "セキュリティ":
      return <Settings className={className} />
    case "生産性":
      return <Calculator className={className} />
    default:
      return null
  }
}

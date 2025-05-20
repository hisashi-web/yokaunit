"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw, Check, Save, List, Grid2X2, Info, Shield, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [multiplePasswords, setMultiplePasswords] = useState<string[]>([])
  const [passwordCount, setPasswordCount] = useState(5)
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copiedIndexes, setCopiedIndexes] = useState<number[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const { toast } = useToast()

  // ログイン状態の確認
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const savedPasswords = localStorage.getItem("savedPasswords")
        if (savedPasswords) {
          setFavorites(JSON.parse(savedPasswords))
        }
      }
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  // 初回レンダリング時にパスワードを生成
  useEffect(() => {
    generatePassword()
    generateMultiplePasswords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // パスワード強度の計算
  useEffect(() => {
    if (!password) return

    let strength = 0
    // 長さによる強度
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1

    // 文字種による強度
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    // 最大値は7
    setPasswordStrength(Math.min(strength, 7))
  }, [password])

  const generatePasswordString = () => {
    let charset = ""
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"
    const numberChars = "23456789"
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    // 似た文字を含める場合の追加文字
    const similarUppercase = "IO"
    const similarLowercase = "l"
    const similarNumbers = "01"

    if (includeUppercase) charset += uppercaseChars + (!excludeSimilar ? similarUppercase : "")
    if (includeLowercase) charset += lowercaseChars + (!excludeSimilar ? similarLowercase : "")
    if (includeNumbers) charset += numberChars + (!excludeSimilar ? similarNumbers : "")
    if (includeSymbols) charset += symbolChars

    // 少なくとも1つの文字種を選択する必要がある
    if (!charset) {
      setIncludeLowercase(true)
      charset = lowercaseChars + (!excludeSimilar ? similarLowercase : "")
    }

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }

    return newPassword
  }

  const generatePassword = () => {
    const newPassword = generatePasswordString()
    setPassword(newPassword)
    setCopied(false)
  }

  const generateMultiplePasswords = () => {
    const newPasswords = []
    for (let i = 0; i < passwordCount; i++) {
      newPasswords.push(generatePasswordString())
    }
    setMultiplePasswords(newPasswords)
    setCopiedIndexes([])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    toast({
      title: "コピーしました",
      description: "パスワードがクリップボードにコピーされました",
    })

    // 3秒後にコピー状態をリセット
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const copyMultiplePassword = (index: number) => {
    navigator.clipboard.writeText(multiplePasswords[index])
    setCopiedIndexes((prev) => [...prev, index])
    toast({
      title: "コピーしました",
      description: "パスワードがクリップボードにコピーされました",
    })

    // 3秒後にコピー状態をリセット
    setTimeout(() => {
      setCopiedIndexes((prev) => prev.filter((i) => i !== index))
    }, 3000)
  }

  const copyAllPasswords = () => {
    const allPasswords = multiplePasswords.join("\n")
    navigator.clipboard.writeText(allPasswords)
    setCopiedIndexes([...Array(multiplePasswords.length).keys()])
    toast({
      title: "すべてコピーしました",
      description: `${multiplePasswords.length}個のパスワードがクリップボードにコピーされました`,
    })

    // 3秒後にコピー状態をリセット
    setTimeout(() => {
      setCopiedIndexes([])
    }, 3000)
  }

  const savePassword = () => {
    if (!isLoggedIn) {
      toast({
        title: "ログインが必要です",
        description: "パスワードを保存するにはログインしてください",
        variant: "destructive",
      })
      return
    }

    if (favorites.includes(password)) {
      toast({
        title: "既に保存済みです",
        description: "このパスワードは既に保存されています",
      })
      return
    }

    const newFavorites = [...favorites, password]
    setFavorites(newFavorites)
    localStorage.setItem("savedPasswords", JSON.stringify(newFavorites))

    toast({
      title: "保存しました",
      description: "パスワードがマイページに保存されました",
    })
  }

  const saveMultiplePassword = (index: number) => {
    if (!isLoggedIn) {
      toast({
        title: "ログインが必要です",
        description: "パスワードを保存するにはログインしてください",
        variant: "destructive",
      })
      return
    }

    const passwordToSave = multiplePasswords[index]
    if (favorites.includes(passwordToSave)) {
      toast({
        title: "既に保存済みです",
        description: "このパスワードは既に保存されています",
      })
      return
    }

    const newFavorites = [...favorites, passwordToSave]
    setFavorites(newFavorites)
    localStorage.setItem("savedPasswords", JSON.stringify(newFavorites))

    toast({
      title: "保存しました",
      description: "パスワードがマイページに保存されました",
    })
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return "弱い"
    if (passwordStrength <= 4) return "普通"
    return "強い"
  }

  const getStrengthIcon = () => {
    if (passwordStrength <= 2) return "text-red-500"
    if (passwordStrength <= 4) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
              <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <CardTitle className="text-xl">パスワード生成ツール</CardTitle>
              <CardDescription>安全なパスワードを簡単に作成</CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                安全なパスワードを生成します。必要に応じて単一または複数のパスワードを作成できます。
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 h-10 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="single"
              className="rounded-md flex items-center gap-2 h-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Grid2X2 className="h-4 w-4" />
              <span>単一パスワード</span>
            </TabsTrigger>
            <TabsTrigger
              value="multiple"
              className="rounded-md flex items-center gap-2 h-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <List className="h-4 w-4" />
              <span>一括生成</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono text-base h-12 border-2 focus:border-indigo-500"
                  readOnly
                />
                <div className="flex ml-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    onClick={copyToClipboard}
                    title="クリップボードにコピー"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 ml-2 border-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    onClick={generatePassword}
                    title="新しいパスワードを生成"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 ml-2 border-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    onClick={savePassword}
                    title="パスワードを保存"
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${getStrengthIcon()}`} />
                  <span className="font-medium">パスワード強度:</span>
                </div>
                <span className={`font-bold ${getStrengthIcon()}`}>{getStrengthText()}</span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${(passwordStrength / 7) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">長さ: {length}</label>
                </div>
                <Slider
                  value={[length]}
                  min={4}
                  max={32}
                  step={1}
                  onValueChange={(value) => setLength(value[0])}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>4</span>
                  <span>16</span>
                  <span>32</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-medium">含める文字</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                    />
                    <label htmlFor="uppercase" className="text-sm">
                      大文字 (A-Z)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                    />
                    <label htmlFor="lowercase" className="text-sm">
                      小文字 (a-z)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                    />
                    <label htmlFor="numbers" className="text-sm">
                      数字 (0-9)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                    />
                    <label htmlFor="symbols" className="text-sm">
                      記号 (!@#$%^&*)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="exclude-similar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
              />
              <label htmlFor="exclude-similar" className="text-sm">
                似た文字を除外 (0, O, 1, l, I)
              </label>
            </div>

            <Button
              size="lg"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={generatePassword}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              新しいパスワードを生成
            </Button>
          </TabsContent>

          <TabsContent value="multiple" className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">生成数:</span>
                  <Badge variant="outline" className="text-sm px-2 py-1 bg-white dark:bg-gray-700">
                    {passwordCount}
                  </Badge>
                </div>
                <Button variant="outline" onClick={copyAllPasswords} className="h-9 text-sm">
                  <Copy className="h-4 w-4 mr-2" />
                  すべてコピー
                </Button>
              </div>

              <Slider
                value={[passwordCount]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setPasswordCount(value[0])}
                className="mb-3"
              />

              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto bg-white dark:bg-gray-700">
                {multiplePasswords.map((pwd, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <code className="font-mono flex-1 truncate text-sm">{pwd}</code>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyMultiplePassword(index)}
                        title="クリップボードにコピー"
                      >
                        {copiedIndexes.includes(index) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => saveMultiplePassword(index)}
                        title="パスワードを保存"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">長さ: {length}</label>
                </div>
                <Slider
                  value={[length]}
                  min={4}
                  max={32}
                  step={1}
                  onValueChange={(value) => setLength(value[0])}
                  className="mb-1"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>4</span>
                  <span>16</span>
                  <span>32</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-medium">含める文字</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase-multi"
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                    />
                    <label htmlFor="uppercase-multi" className="text-sm">
                      大文字 (A-Z)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase-multi"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                    />
                    <label htmlFor="lowercase-multi" className="text-sm">
                      小文字 (a-z)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers-multi"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                    />
                    <label htmlFor="numbers-multi" className="text-sm">
                      数字 (0-9)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols-multi"
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                    />
                    <label htmlFor="symbols-multi" className="text-sm">
                      記号 (!@#$%^&*)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="exclude-similar-multi"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
              />
              <label htmlFor="exclude-similar-multi" className="text-sm">
                似た文字を除外 (0, O, 1, l, I)
              </label>
            </div>

            <Button
              size="lg"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={generateMultiplePasswords}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              新しいパスワードを一括生成
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-indigo-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">パスワード作成のヒント</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 bg-white dark:bg-gray-700">
                安全性
              </Badge>
              <p>16文字以上で大文字・小文字・数字・記号を含むパスワードが最も安全です。</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 bg-white dark:bg-gray-700">
                活用法
              </Badge>
              <p>一括生成機能で複数のアカウント用パスワードを作成できます。</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 bg-white dark:bg-gray-700">
                保存
              </Badge>
              <p>ログインするとパスワードを保存して後で確認できます。</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface TestData {
  id: number
  name: string | null
  created_at: string
}

export default function TestPage() {
  const [testData, setTestData] = useState<TestData[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()

  const fetchTestData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("test").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching test data:", error)
        toast({
          title: "エラー",
          description: `データの取得に失敗しました: ${error.message}`,
          variant: "destructive",
        })
      } else {
        setTestData(data || [])
        toast({
          title: "成功",
          description: "データを正常に取得しました",
        })
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      toast({
        title: "エラー",
        description: "予期しないエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTestData = async () => {
    if (!newName.trim()) return

    try {
      setAdding(true)
      const { error } = await supabase.from("test").insert([{ name: newName }])

      if (error) {
        console.error("Error adding test data:", error)
        toast({
          title: "エラー",
          description: `データの追加に失敗しました: ${error.message}`,
          variant: "destructive",
        })
      } else {
        setNewName("")
        fetchTestData()
        toast({
          title: "成功",
          description: "データを追加しました",
        })
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      toast({
        title: "エラー",
        description: "予期しないエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  useEffect(() => {
    fetchTestData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>データベース接続テスト</CardTitle>
            <CardDescription>Supabaseデータベースの接続状況とtestテーブルのデータを確認します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="name">新しいテストデータ</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="テストデータの名前を入力"
                  disabled={adding}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addTestData} disabled={adding || !newName.trim()}>
                  {adding ? "追加中..." : "追加"}
                </Button>
              </div>
            </div>
            <Button onClick={fetchTestData} disabled={loading} variant="outline">
              {loading ? "読み込み中..." : "データを再読み込み"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>testテーブルのデータ</CardTitle>
            <CardDescription>
              {loading ? "データを読み込み中..." : `${testData.length}件のデータが見つかりました`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>データを読み込み中...</p>
              </div>
            ) : testData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">データがありません</p>
                <p className="text-sm text-gray-400 mt-2">上記のフォームから新しいデータを追加してください</p>
              </div>
            ) : (
              <div className="space-y-2">
                {testData.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">ID: {item.id}</p>
                        <p className="text-gray-600">名前: {item.name || "未設定"}</p>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString("ja-JP")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>接続情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "設定済み" : "未設定"}
              </p>
              <p>
                <strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "設定済み" : "未設定"}
              </p>
              <p>
                <strong>現在時刻:</strong> {new Date().toLocaleString("ja-JP")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

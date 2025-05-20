'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type TestItem = {
  id: number
  content: string
  description: string
  created_at: string
}

export default function TestPage() {
  const [data, setData] = useState<TestItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('test')
        .select('id, content, description, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('エラー:', error)
      } else {
        setData(data || [])
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supabaseからのデータ</h1>
      {data.length === 0 ? (
        <p>データがありません。</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="p-4 border rounded shadow">
              <p className="font-semibold">{item.content}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

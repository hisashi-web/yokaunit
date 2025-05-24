import { supabase } from '../lib/supabaseClient'

export default function TestData({ tests }) {
  return (
    <div>
      <h1>Supabaseから取得した「test」テーブルのデータ一覧</h1>
      <ul>
        {tests.map(item => (
          <li key={item.id} style={{ marginBottom: '1em' }}>
            <strong>{item.content}</strong><br />
            <em>{item.description || 'No description'}</em><br />
            <small>{new Date(item.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('test')
    .select('id, content, description, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabaseエラー:', error)
  }

  return {
    props: {
      tests: data || [],
    },
  }
}

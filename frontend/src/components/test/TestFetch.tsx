import { useEffect, useState } from 'react'

export function TestFetch() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/products', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        console.log('Fetch succeeded:', d.success, 'count:', d.data?.length)
        setData(d)
      })
      .catch(e => console.error('Fetch failed:', e))
  }, [])

  return (
    <div className="p-8">
      <h1>Test Fetch</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
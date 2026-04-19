import { useEffect, useState } from 'react'

export function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetch('/api/products', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        console.log('SUCCESS:', d.success, 'COUNT:', d.data?.length)
        setData(d)
      })
      .catch(e => {
        console.error('ERROR:', e)
        setError(e.message)
      })
  }, [])

  if (error) return <div className="p-8 text-red-500">ERROR: {error}</div>
  if (!data) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl text-neon-green mb-4">Products: {data.data?.length}</h1>
      {data.data?.slice(0,3).map((p: any) => (
        <div key={p.productId} className="text-white">{p.shoeName}</div>
      ))}
    </div>
  )
}
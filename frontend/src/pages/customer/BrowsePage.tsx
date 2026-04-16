import { useNavigate } from 'react-router'

export function BrowsePage() {
  const navigate = useNavigate()
  const products = [
    { productId: 1, shoeName: 'Air Jordan 1', brand: 'Nike' },
    { productId: 2, shoeName: 'Yeezy 350', brand: 'Adidas' },
    { productId: 3, shoeName: 'Dunk Low', brand: 'Nike' },
    { productId: 4, shoeName: 'New Balance 550', brand: 'NB' },
    { productId: 5, shoeName: 'Air Force 1', brand: 'Nike' },
  ]

  return (
    <div className="min-h-screen bg-void p-8">
      <h1 className="text-4xl text-neon-green mb-8">BROWSE</h1>
      <div className="text-white grid grid-cols-2 gap-4">
        {products.map(p => (
          <div
            key={p.productId}
            onClick={() => navigate(`/product/${p.productId}`)}
            className="bg-asphalt p-4 border border-smoke cursor-pointer hover:border-neon-green transition-colors"
          >
            <h2 className="text-lg">{p.shoeName}</h2>
            <p className="text-dust">{p.brand}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
// File: frontend/src/pages/test/TestPage.tsx
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function TestPage() {
  // Mock data based on your Java Product and Listing models
  const mockListing = {
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800',
    shoeName: 'Nike Air Force 1 Low 07',
    size: '10',
    condition: 'NEW',
    price: '$120.00'
  }

  return (
    <div className="min-h-screen bg-void p-10 flex flex-col items-center justify-center">
      <h1 className="text-neon-green font-heading text-3xl mb-10 tracking-widest uppercase">
        UI Sandbox: Card Component
      </h1>

      {/* The Component Test */}
      <div className="w-full max-w-sm">
        <Card>
          <Card.Image src={mockListing.imageUrl} alt={mockListing.shoeName} />
          <Card.Body>
            <Card.Title>{mockListing.shoeName}</Card.Title>
            <p className="text-dust font-body text-sm mt-2">
              Size: {mockListing.size} | Condition: {mockListing.condition}
            </p>
          </Card.Body>
          <Card.Footer>
            <span className="text-price font-mono text-lg">{mockListing.price}</span>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">Edit</Button>
              <Button variant="danger" size="sm">Remove</Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}
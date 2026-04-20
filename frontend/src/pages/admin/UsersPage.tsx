import { useState } from 'react'
import { Card } from '@components/ui/Card' // Fixed alias and strict import
import { Button } from '@components/ui/Button' // Fixed alias

type Role = 'ADMIN' | 'SELLER' | 'CUSTOMER'
type Status = 'ACTIVE' | 'INACTIVE'

interface User {
  userId: number
  username: string
  email: string
  role: Role
  status: Status
}

const MOCK_USERS: User[] = [
  { userId: 1, username: 'admin_boss', email: 'admin@hypeculture.com', role: 'ADMIN', status: 'ACTIVE' },
  { userId: 8, username: 'power_seller_steve', email: 'steve@hypeculture.com', role: 'SELLER', status: 'ACTIVE' },
  { userId: 7, username: 'jordanfan99', email: 'jordan@example.com', role: 'CUSTOMER', status: 'INACTIVE' },
]

export function UsersPage() { // Renamed to match your router.tsx
  const [users, setUsers] = useState<User[]>(MOCK_USERS)

  const handleToggleStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === userId
          ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : user
      )
    )
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-8">Manage Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.userId}>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <div className="flex flex-col gap-1 mt-2 text-dust font-body text-sm">
                <span>{user.email}</span>
                <span className="uppercase">{user.role}</span>
                <span className={user.status === 'ACTIVE' ? 'text-neon-green font-bold' : 'text-danger font-bold'}>
                  {user.status}
                </span>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => handleToggleStatus(user.userId)}
              >
                {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  )
}
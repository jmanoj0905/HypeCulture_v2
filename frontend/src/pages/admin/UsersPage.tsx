import { useEffect, useState } from 'react'
import { Card } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Spinner } from '@components/ui/Spinner'
import { getUsers, deactivateUser, activateUser } from '@api/users'
import type { User } from '@api/auth'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    getUsers()
      .then((res) => {
        if (res.data.success) setUsers(res.data.data)
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleStatus = async (user: User) => {
    setActionLoading(user.userId)
    try {
      if (user.status === 'ACTIVE') {
        await deactivateUser(user.userId)
      } else {
        await activateUser(user.userId)
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === user.userId
            ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : u
        )
      )
    } catch {
      setError('Action failed. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h1 className="font-display text-5xl text-white mb-2">Manage Users</h1>
      <p className="text-dust font-mono text-sm mb-8">{users.length} total users</p>
      {error && <p className="text-danger font-mono text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.userId}>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <div className="flex flex-col gap-1 mt-2 text-dust font-body text-sm">
                <span>{user.email}</span>
                <span className="uppercase font-mono text-xs">{user.role}</span>
                <span className={user.status === 'ACTIVE' ? 'text-neon-green font-bold' : 'text-danger font-bold'}>
                  {user.status}
                </span>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}
                size="sm"
                loading={actionLoading === user.userId}
                onClick={() => handleToggleStatus(user)}
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

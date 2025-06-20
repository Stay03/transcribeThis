import { useAuth } from '../../contexts/AuthContext'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import ThemeSwitcher from '../ThemeSwitcher'

function AdminHeader({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b bg-card">
      <div className="flex items-center space-x-4">
        {/* Mobile hamburger menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeSwitcher />
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
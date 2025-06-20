import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip } from '../ui/tooltip'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Plans', href: '/admin/plans', icon: CreditCard },
  { name: 'Transcriptions', href: '/admin/transcriptions', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function AdminSidebar({ isOpen, isCollapsed, onClose, onToggleCollapsed }) {
  const { logout } = useAuth()

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-card border-r transition-all duration-300 ease-in-out",
        // Mobile behavior
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        // Desktop width based on collapsed state
        isCollapsed ? "md:w-16" : "md:w-64",
        // Always full width on mobile
        "w-64"
      )}>
        {/* Header with title and collapse/close buttons */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
          <h1 className={cn(
            "text-xl font-semibold transition-opacity duration-300",
            isCollapsed ? "md:opacity-0 md:hidden" : "opacity-100"
          )}>
            Admin Panel
          </h1>
          
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapsed}
            className="hidden md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className={cn(
          "flex-1 mt-3 space-y-1 transition-all duration-300",
          isCollapsed ? "md:px-2" : "px-4"
        )}>
          {navigation.map((item) => {
            const navLinkContent = (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center text-sm font-medium rounded-md transition-all duration-300 touch-manipulation',
                    isCollapsed ? 'md:justify-center md:px-2 md:py-3 px-3 py-2' : 'px-3 py-2',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )
                }
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isCollapsed ? "md:mr-0" : "mr-3"
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  "transition-all duration-300 overflow-hidden",
                  isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
                )}>
                  {item.name}
                </span>
              </NavLink>
            )

            // Wrap with tooltip for collapsed state on desktop only
            return (
              <div key={item.name}>
                {isCollapsed ? (
                  <>
                    {/* Desktop collapsed with tooltip */}
                    <div className="hidden md:block">
                      <Tooltip content={item.name} side="right">
                        {navLinkContent}
                      </Tooltip>
                    </div>
                    {/* Mobile expanded (ignore collapsed state) */}
                    <div className="md:hidden">
                      <NavLink
                        to={item.href}
                        end={item.href === '/admin'}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors touch-manipulation',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          )
                        }
                      >
                        <item.icon
                          className="mr-3 h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    </div>
                  </>
                ) : (
                  navLinkContent
                )}
              </div>
            )
          })}
        </nav>
        
        <div className={cn(
          "border-t transition-all duration-300",
          isCollapsed ? "md:px-2" : "px-4",
          "p-4"
        )}>
          {isCollapsed ? (
            <>
              {/* Desktop collapsed logout with tooltip */}
              <div className="hidden md:block">
                <Tooltip content="Sign out" side="right">
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-center px-2 py-3 text-muted-foreground hover:text-foreground touch-manipulation"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </Tooltip>
              </div>
              {/* Mobile expanded logout */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground touch-manipulation"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-muted-foreground hover:text-foreground touch-manipulation transition-all duration-300"
            >
              <LogOut className={cn(
                "h-5 w-5 transition-all duration-300",
                isCollapsed ? "md:mr-0" : "mr-3"
              )} />
              <span className={cn(
                "transition-all duration-300 overflow-hidden",
                isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
              )}>
                Sign out
              </span>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
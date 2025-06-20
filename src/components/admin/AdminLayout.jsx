import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage, default to false (expanded)
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapsed={toggleSidebarCollapsed}
      />
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        // On desktop, adjust margin based on sidebar state
        // On mobile, no margin (sidebar is overlay)
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
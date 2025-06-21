import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Eye, Edit2, Trash2, UserPlus, Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { apiService } from '../../services/api'
import { formatDate } from '../../utils/dateFormat'
import { toast } from 'sonner'

function AdminUsers() {
  const { id } = useParams()
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    page: 1
  })
  const [editingUser, setEditingUser] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getInitials = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (id) {
      fetchUser()
    } else {
      fetchUsers()
    }
  }, [id, filters])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAdminUser(id)
      setUser({ ...data.user, stats: data.stats })
    } catch (error) {
      toast.error('Failed to fetch user: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Filter out 'all' and empty values before sending to API
      const apiFilters = {}
      if (filters.search) apiFilters.search = filters.search
      if (filters.role && filters.role !== 'all') apiFilters.role = filters.role
      if (filters.page) apiFilters.page = filters.page

      const data = await apiService.getAdminUsers(apiFilters)
      setUsers(data.users)
      setPagination(data.meta)
    } catch (error) {
      toast.error('Failed to fetch users: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (search) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleEditUser = (user) => {
    setEditingUser({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      await apiService.updateAdminUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      })
      toast.success('User updated successfully')
      setIsEditDialogOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user: ' + error.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await apiService.deleteAdminUser(userId)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user: ' + error.message)
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {user.avatar && (
              <AvatarImage 
                src={user.avatar} 
                alt={user.name}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{value}</span>
              {user.google_id && (
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      render: (value) => (
        <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'current_subscription',
      title: 'Plan',
      render: (value) => (
        <Badge variant="outline">
          {value?.plan?.name || 'No Plan'}
        </Badge>
      )
    },
    {
      key: 'usage',
      title: 'Usage',
      render: (value) => {
        const currentMonth = value?.[0]
        return currentMonth ? `${currentMonth.transcriptions_used} transcriptions` : '0 transcriptions'
      }
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/admin/users/${user.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(user)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {user.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      key: 'role',
      placeholder: 'Role',
      value: filters.role,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' }
      ]
    }
  ]

  if (id) {
    // Individual user view
    if (loading) {
      return (
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading user...</p>
            </div>
          </div>
        </AdminLayout>
      )
    }

    if (!user) {
      return (
        <AdminLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/admin/users">← Back to Users</Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground">The requested user could not be found</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      )
    }

    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/users">← Back to Users</Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">User Details</p>
            </div>
          </div>

          {/* User Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {user.avatar && (
                    <AvatarImage 
                      src={user.avatar} 
                      alt={user.name}
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    {user.google_id && (
                      <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant="outline">
                      ID: {user.id}
                    </Badge>
                    {user.email_verified_at ? (
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transcriptions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats?.total_transcriptions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{user.stats?.completed_transcriptions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{user.stats?.failed_transcriptions || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Age</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats?.account_age_days || 0} days</div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription and Usage Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-80">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto pr-2">
                <div className="space-y-4">
                  {user.subscriptions && user.subscriptions.length > 0 ? (
                    user.subscriptions.map((subscription) => (
                      <div key={subscription.id} className="space-y-2 pb-4 border-b last:border-b-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{subscription.plan?.name}</span>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{subscription.plan?.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="ml-2 font-medium">${subscription.plan?.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monthly Limit:</span>
                            <span className="ml-2 font-medium">{subscription.plan?.monthly_transcriptions}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max File Size:</span>
                            <span className="ml-2 font-medium">{subscription.plan?.max_file_size_mb}MB</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Started:</span>
                            <span className="ml-2 font-medium">{formatDate(subscription.starts_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No active subscription</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="h-80">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto pr-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Month ({user.current_month_usage?.month}/{user.current_month_usage?.year})</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transcriptions Used:</span>
                        <span className="font-medium">{user.current_month_usage?.transcriptions_used || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prompts Used:</span>
                        <span className="font-medium">{user.current_month_usage?.prompts_used || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total File Size:</span>
                        <span className="font-medium">{user.current_month_usage?.total_file_size_mb || 0}MB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{formatDate(user.updated_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email Verified:</span>
                        <span className="font-medium">
                          {user.email_verified_at ? formatDate(user.email_verified_at) : 'Not verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.usage && user.usage.length > 1 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Historical Usage</h4>
                      <div className="space-y-2">
                        {user.usage.slice(1).map((monthUsage) => (
                          <div key={`${monthUsage.year}-${monthUsage.month}`} className="text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">{monthUsage.month}/{monthUsage.year}:</span>
                              <span className="font-medium">{monthUsage.transcriptions_used} transcriptions</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search users..."
          filters={filterOptions}
        />

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value) => setEditingUser(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
import { useState, useEffect } from 'react'
import { Users, Circle, Wifi, WifiOff, Clock, Globe, Smartphone, RefreshCcw, MapPin, User, Mail, Calendar, Monitor, Network, Shield, X } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Skeleton } from '../../components/ui/skeleton'
import { Tooltip } from '../../components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { apiService } from '../../services/api'
import { formatDate } from '../../utils/dateFormat'
import { toast } from 'sonner'

function AdminActivityUsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState({
    duration: '24h',
    sort_by: 'last_activity',
    sort_order: 'desc',
    per_page: '25',
    page: 1,
    status_filter: 'all',
    user_type: 'all',
    country: 'all'
  })
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getInitials = (name) => {
    if (!name || name === 'Guest User') return 'G'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserAgent = (userAgent) => {
    if (!userAgent) return 'Unknown'
    
    // Simple user agent parsing
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    
    return 'Other'
  }

  const getBrowserIcon = (userAgent) => {
    if (!userAgent) return Globe
    if (userAgent.includes('iPhone') || userAgent.includes('Android')) return Smartphone
    return Globe
  }

  useEffect(() => {
    fetchUsers()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUsers(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [filters])

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      // Clean filters for API
      const apiFilters = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          apiFilters[key] = value
        }
      })

      const data = await apiService.getAdminActivityUsersList(apiFilters)
      setUsers(data.data || [])
      setPagination(data.meta)
      setLastUpdated(new Date())
    } catch (error) {
      toast.error('Failed to fetch user activity: ' + error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      toast.success('Refreshing user activity...')
    }
    fetchUsers(true)
  }

  const handleSearch = () => {
    // Search is handled via user_type and status_filter in this API
    // Could be extended to support name/email search if API supports it
  }

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleSortChange = (sortBy) => {
    const newOrder = filters.sort_by === sortBy && filters.sort_order === 'desc' ? 'asc' : 'desc'
    setFilters(prev => ({ 
      ...prev, 
      sort_by: sortBy, 
      sort_order: newOrder,
      page: 1 
    }))
  }

  const handleRowClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const columns = [
    {
      key: 'name',
      title: 'User',
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
              user.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            {user.google_id && (
              <div className="absolute -top-1 -left-1 h-4 w-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{value}</span>
              <Badge variant={user.type === 'registered' ? 'default' : 'secondary'} className="text-xs">
                {user.type}
              </Badge>
            </div>
            {user.email && (
              <div className="text-sm text-muted-foreground">{user.email}</div>
            )}
            {user.role && (
              <Badge variant="outline" className="text-xs mt-1">
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'last_activity',
      title: 'Last Activity',
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium">{formatDate(value)}</div>
          <div className="text-muted-foreground">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'user_agent',
      title: 'Device',
      render: (value, user) => {
        const BrowserIcon = getBrowserIcon(value)
        const device = getUserAgent(value)
        
        const tooltipContent = (
          <div className="max-w-sm">
            <p className="font-medium">User Agent:</p>
            <p className="text-xs break-all">{value || 'Not available'}</p>
            {user.ip_addresses && user.ip_addresses.length > 0 && (
              <>
                <p className="font-medium mt-2">IP Addresses:</p>
                <p className="text-xs">{user.ip_addresses.join(', ')}</p>
              </>
            )}
            {user.location && (
              <>
                <p className="font-medium mt-2">Location:</p>
                <p className="text-xs">{user.location.formatted}</p>
              </>
            )}
          </div>
        )

        return (
          <Tooltip content={tooltipContent} side="top">
            <div className="flex items-center gap-2 cursor-help">
              <BrowserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{device}</span>
            </div>
          </Tooltip>
        )
      }
    },
    {
      key: 'location',
      title: 'Location',
      render: (value) => {
        if (!value) {
          return (
            <span className="text-muted-foreground text-sm">Unknown</span>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {value.country_code && (
                <img
                  src={`https://flagcdn.com/w20/${value.country_code.toLowerCase()}.png`}
                  alt={value.country}
                  className="w-4 h-3 rounded-sm"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <MapPin className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{value.city || value.country}</div>
              <div className="text-xs text-muted-foreground">
                {value.country_code && `${value.country_code} • `}{value.country}
              </div>
            </div>
          </div>
        )
      }
    }
  ]

  // Extract unique countries from current users for filter options
  const uniqueCountries = [...new Set(users
    .filter(user => user.location?.country)
    .map(user => user.location.country)
  )].sort()

  // Filter options for the DataTable
  const filterOptions = [
    {
      key: 'duration',
      placeholder: 'Duration',
      value: filters.duration,
      options: [
        { value: '1h', label: 'Last Hour' },
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' }
      ]
    },
    {
      key: 'status_filter',
      placeholder: 'Status',
      value: filters.status_filter,
      options: [
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' }
      ]
    },
    {
      key: 'user_type',
      placeholder: 'User Type',
      value: filters.user_type,
      options: [
        { value: 'registered', label: 'Registered' },
        { value: 'guest', label: 'Guest' }
      ]
    },
    ...(uniqueCountries.length > 0 ? [{
      key: 'country',
      placeholder: 'Country',
      value: filters.country,
      options: uniqueCountries.map(country => ({
        value: country,
        label: country
      }))
    }] : [])
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Active Users</h1>
            <p className="text-muted-foreground">
              Users who have been active in the selected time period
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <Button 
              onClick={() => handleRefresh()} 
              variant="outline" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Activity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold">
                    {pagination?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    total active in {filters.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {users.filter(u => u.online_status === 'online').length} online now
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.type === 'registered').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    registered users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {users.filter(u => u.type === 'registered' && u.online_status === 'online').length} online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guests</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter(u => u.type === 'guest').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    guest users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {users.filter(u => u.type === 'guest' && u.online_status === 'online').length} online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <MapPin className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {uniqueCountries.length}
              </div>
              <p className="text-xs text-muted-foreground">
                unique countries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User List Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Activity List</CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={filters.sort_by}
                  onValueChange={(value) => handleSortChange(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_activity">Last Activity</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.sort_order}
                  onValueChange={(value) => handleFilter('sort_order', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Desc</SelectItem>
                    <SelectItem value="asc">Asc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onRowClick={handleRowClick}
              searchPlaceholder="Filter by type or status..."
              filters={filterOptions}
            />
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="!max-w-6xl !w-[90vw] max-h-[90vh] overflow-y-auto sm:!max-w-6xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    {selectedUser?.avatar ? (
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(selectedUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                    selectedUser?.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {selectedUser?.google_id && (
                    <div className="absolute -top-1 -left-1 h-4 w-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{selectedUser?.name}</span>
                    <Badge variant={selectedUser?.type === 'registered' ? 'default' : 'secondary'} className="text-xs">
                      {selectedUser?.type}
                    </Badge>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6">
                {/* Basic Information and Activity Information in same row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm">{selectedUser.name}</p>
                        </div>
                        {selectedUser.email && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-sm">{selectedUser.email}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">User Type</label>
                          <p className="text-sm">{selectedUser.type}</p>
                        </div>
                        {selectedUser.role && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Role</label>
                            <p className="text-sm">{selectedUser.role}</p>
                          </div>
                        )}
                        {selectedUser.id && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">User ID</label>
                            <p className="text-sm font-mono">{selectedUser.id}</p>
                          </div>
                        )}
                        {selectedUser.google_id && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Google ID</label>
                            <p className="text-sm font-mono">{selectedUser.google_id}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="h-4 w-4" />
                        Activity Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="flex items-center gap-2">
                            {selectedUser.online_status === 'online' ? (
                              <>
                                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                <span className="text-green-600 text-sm font-medium">Online</span>
                              </>
                            ) : (
                              <>
                                <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                                <span className="text-muted-foreground text-sm">Offline</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Total Sessions</label>
                          <p className="text-sm">{selectedUser.total_sessions} in {filters.duration}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                          <p className="text-sm">{formatDate(selectedUser.last_activity)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(selectedUser.last_activity).toLocaleTimeString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">First Activity (Period)</label>
                          <p className="text-sm">{formatDate(selectedUser.first_activity_in_period)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Technical Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Monitor className="h-4 w-4" />
                      Technical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                      <p className="text-sm break-all bg-muted p-2 rounded">{selectedUser.user_agent}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Device: {getUserAgent(selectedUser.user_agent)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IP Addresses</label>
                      <div className="space-y-1">
                        {selectedUser.ip_addresses?.map((ip, index) => (
                          <p key={index} className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block mr-2">
                            {ip}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Location Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedUser.location?.country ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <div className="flex items-center gap-2">
                            {selectedUser.location.country_code && (
                              <img
                                src={`https://flagcdn.com/w20/${selectedUser.location.country_code.toLowerCase()}.png`}
                                alt={selectedUser.location.country}
                                className="w-4 h-3 rounded-sm"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                            )}
                            <span className="text-sm">{selectedUser.location.country}</span>
                            {selectedUser.location.country_code && (
                              <Badge variant="outline" className="text-xs">
                                {selectedUser.location.country_code}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedUser.location.region_name && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Region</label>
                            <p className="text-sm">{selectedUser.location.region_name}</p>
                          </div>
                        )}
                        {selectedUser.location.city && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">City</label>
                            <p className="text-sm">{selectedUser.location.city}</p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                          <p className="text-sm">{selectedUser.location.formatted}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Location information not available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminActivityUsersList
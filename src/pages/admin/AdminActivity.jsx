import { useState, useEffect } from 'react'
import { Activity, Users, UserCheck, Clock, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Skeleton } from '../../components/ui/skeleton'
import { apiService } from '../../services/api'
import { formatDate } from '../../utils/dateFormat'

function AdminActivity() {
  const [analytics, setAnalytics] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trendsLoading, setTrendsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trendsPeriod, setTrendsPeriod] = useState('30')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchActivityData()
    fetchTrendsData(trendsPeriod)
    
    // Set up auto-refresh for online users every 30 seconds
    const interval = setInterval(() => {
      fetchOnlineUsers()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchTrendsData(trendsPeriod)
  }, [trendsPeriod])

  const fetchActivityData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getActivityAnalytics()
      setAnalytics(data.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      const data = await apiService.getOnlineUsers()
      if (analytics) {
        setAnalytics(prev => ({
          ...prev,
          online: data.data
        }))
      }
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to refresh online users:', err)
    }
  }

  const fetchTrendsData = async (days) => {
    try {
      setTrendsLoading(true)
      const data = await apiService.getActivityTrends(parseInt(days))
      setTrends(data.data)
    } catch (err) {
      console.error('Failed to fetch trends:', err)
    } finally {
      setTrendsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchActivityData()
    fetchTrendsData(trendsPeriod)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">User Activity</h1>
            <p className="text-muted-foreground">Real-time user activity and engagement metrics</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Error loading activity data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh}>
              Try again
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Activity</h1>
            <p className="text-muted-foreground">Real-time user activity and engagement metrics</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
            <Button asChild size="sm">
              <Link to="/admin/activity/users">
                <Users className="h-4 w-4 mr-2" />
                View All Active Users
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Activity Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Online Now"
            value={analytics?.online?.total || 0}
            description={`${analytics?.online?.registered_users || 0} users, ${analytics?.online?.guests || 0} guests`}
            icon={Activity}
            className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
          />
          <StatsCard
            title="Today"
            value={analytics?.daily?.total || 0}
            description={`${analytics?.daily?.registered_users || 0} users, ${analytics?.daily?.guests || 0} guests`}
            icon={Calendar}
          />
          <StatsCard
            title="This Week"
            value={analytics?.weekly?.total || 0}
            description={`${analytics?.weekly?.registered_users || 0} users, ${analytics?.weekly?.guests || 0} guests`}
            icon={UserCheck}
          />
          <StatsCard
            title="This Month"
            value={analytics?.monthly?.total || 0}
            description={`${analytics?.monthly?.registered_users || 0} users, ${analytics?.monthly?.guests || 0} guests`}
            icon={TrendingUp}
          />
        </div>

        {/* Detailed Activity Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Online Users Detail */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Online Users
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/activity/users?status_filter=online">
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Registered Users</span>
                  <Badge variant="default">{analytics?.online?.registered_users || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Guest Users</span>
                  <Badge variant="secondary">{analytics?.online?.guests || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Online</span>
                  <Badge variant="outline">{analytics?.online?.total || 0}</Badge>
                </div>
                {analytics?.online?.timestamp && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatDate(analytics.online.timestamp)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Period Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Periods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {analytics?.daily?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {analytics?.weekly?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {analytics?.monthly?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Week Details</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Period: {analytics?.weekly?.start_date} to {analytics?.weekly?.end_date}</p>
                    <p>Registered: {analytics?.weekly?.registered_users || 0}</p>
                    <p>Guests: {analytics?.weekly?.guests || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Trends */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Activity Trends</CardTitle>
              <Select value={trendsPeriod} onValueChange={setTrendsPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <Skeleton className="h-64" />
            ) : trends?.trends?.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">
                      {trends.trends.reduce((sum, day) => sum + day.total, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Activity</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">
                      {Math.round(trends.trends.reduce((sum, day) => sum + day.total, 0) / trends.trends.length)}
                    </div>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-lg font-bold">
                      {Math.max(...trends.trends.map(day => day.total))}
                    </div>
                    <p className="text-sm text-muted-foreground">Peak Day</p>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {trends.trends.slice(-10).reverse().map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{formatDate(day.date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {day.registered_users} users, {day.guests} guests
                          </p>
                        </div>
                        <Badge variant="outline">{day.total}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No trend data available for the selected period
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminActivity
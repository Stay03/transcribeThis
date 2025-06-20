import { useState, useEffect } from 'react'
import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { apiService } from '../../services/api'
import { formatDate } from '../../utils/dateFormat'

function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAdminDashboardOverview()
      setOverview(data.overview)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">System overview and statistics</p>
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
            <h2 className="text-lg font-semibold mb-2">Error loading dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
      pending: 'outline'
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">System overview and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={overview?.users?.total || 0}
            description={`${overview?.users?.new_this_month || 0} new this month`}
            icon={Users}
          />
          <StatsCard
            title="Total Transcriptions"
            value={overview?.transcriptions?.total || 0}
            description={`${overview?.transcriptions?.completed || 0} completed`}
            icon={FileText}
          />
          <StatsCard
            title="Active Subscriptions"
            value={overview?.plans?.total_active_subscriptions || 0}
            description={`${overview?.plans?.total_plans || 0} plans available`}
            icon={CreditCard}
          />
          <StatsCard
            title="Processing"
            value={overview?.transcriptions?.processing || 0}
            description={`${overview?.transcriptions?.failed || 0} failed`}
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.recent_activity?.recent_users?.length > 0 ? (
                  overview.recent_activity.recent_users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{user.role}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent users
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transcriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transcriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.recent_activity?.recent_transcriptions?.length > 0 ? (
                  overview.recent_activity.recent_transcriptions.map((transcription) => (
                    <div key={transcription.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate max-w-48">
                          {transcription.original_filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transcription.user?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(transcription.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(transcription.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent transcriptions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {overview?.users?.regular_users || 0}
                </div>
                <p className="text-sm text-muted-foreground">Regular Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {overview?.users?.admins || 0}
                </div>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {overview?.users?.new_this_month || 0}
                </div>
                <p className="text-sm text-muted-foreground">New This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
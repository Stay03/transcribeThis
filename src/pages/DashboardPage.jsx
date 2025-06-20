import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  Upload,
  History,
  Crown,
  BarChart3,
  Users,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const [usageStats, setUsageStats] = useState(null)
  const [accountStats, setAccountStats] = useState(null)
  const [recentTranscriptions, setRecentTranscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { user, currentPlan } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usage, account, transcriptions] = await Promise.all([
          apiService.getUsageStats(),
          apiService.getAccountStats(),
          apiService.getTranscriptions(1, 5)
        ])
        
        setUsageStats(usage.usage)
        setAccountStats(account.account_stats)
        setRecentTranscriptions(transcriptions.transcriptions || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUsagePercentage = (used, total) => {
    return total > 0 ? (used / total) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's your transcription activity and usage overview
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link to="/transcribe">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">New Transcription</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload and transcribe audio files
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/history">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <History className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">View History</h3>
                      <p className="text-sm text-muted-foreground">
                        Access your past transcriptions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Usage Statistics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="h-5 w-5" />
                      <span>Current Plan</span>
                    </CardTitle>
                    {!currentPlan?.is_free && (
                      <Badge variant="secondary">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {currentPlan?.name || 'Free'} Plan
                      </span>
                      {currentPlan?.is_free && (
                        <Link to="/settings">
                          <Button size="sm">
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    {usageStats && (
                      <div className="space-y-4">
                        {/* Transcriptions Usage */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Monthly Transcriptions</span>
                            <span className="font-medium">
                              {usageStats.current_usage.transcriptions_used} / {usageStats.limits.monthly_transcriptions}
                            </span>
                          </div>
                          <Progress 
                            value={getUsagePercentage(
                              usageStats.current_usage.transcriptions_used,
                              usageStats.limits.monthly_transcriptions
                            )}
                            className="h-2"
                          />
                        </div>

                        {/* Prompts Usage */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Custom Prompts</span>
                            <span className="font-medium">
                              {usageStats.current_usage.prompts_used} / {usageStats.limits.total_prompts}
                            </span>
                          </div>
                          <Progress 
                            value={getUsagePercentage(
                              usageStats.current_usage.prompts_used,
                              usageStats.limits.total_prompts
                            )}
                            className="h-2"
                          />
                        </div>

                        {/* File Size Limit */}
                        <div className="flex justify-between text-sm">
                          <span>Max File Size</span>
                          <span className="font-medium">{usageStats.limits.max_file_size_mb}MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              {accountStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Account Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {accountStats.total_transcriptions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Transcriptions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {accountStats.completed_transcriptions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {accountStats.average_processing_time?.toFixed(1)}s
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Avg. Processing Time
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transcriptions</CardTitle>
                  <CardDescription>
                    Your latest transcription activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTranscriptions.length > 0 ? (
                    recentTranscriptions.map((transcription) => (
                      <div key={transcription.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                        <div className="p-2 bg-muted rounded-lg">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {transcription.original_filename}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={transcription.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transcription.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(transcription.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transcriptions yet</p>
                      <Link to="/transcribe">
                        <Button size="sm" className="mt-2">
                          Start Transcribing
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Pro Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium mb-1">Use custom prompts</p>
                    <p className="text-muted-foreground">
                      Add specific instructions to improve transcription accuracy
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Clear audio quality</p>
                    <p className="text-muted-foreground">
                      Better audio quality leads to more accurate transcriptions
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Multiple formats</p>
                    <p className="text-muted-foreground">
                      We support MP3, WAV, M4A, and more
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
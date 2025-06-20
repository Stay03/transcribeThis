import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  User, 
  Lock, 
  Crown, 
  CreditCard, 
  CheckCircle,
  Loader2,
  AlertTriangle,
  Trash2,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [usageStats, setUsageStats] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [profileData, setProfileData] = useState({ name: '', email: '' })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState({})
  
  const { user, currentPlan, updateProfile, refreshProfile } = useAuth()

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email })
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [plansData, usageData, subscriptionData] = await Promise.all([
        apiService.getPlans(),
        apiService.getUsageStats(),
        apiService.getCurrentSubscription()
      ])
      
      setPlans(plansData.plans || [])
      setUsageStats(usageData.usage)
      setSubscription(subscriptionData)
    } catch (error) {
      console.error('Failed to fetch settings data:', error)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const result = await updateProfile(profileData)
    
    if (result.success) {
      toast.success('Profile updated successfully!')
    } else {
      setErrors({ profile: result.error })
    }
    
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (passwordData.password !== passwordData.password_confirmation) {
      setErrors({ password: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      await apiService.changePassword(passwordData)
      toast.success('Password updated successfully!')
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      })
    } catch (error) {
      setErrors({ password: error.message })
    }
    
    setLoading(false)
  }

  const handleSubscribe = async (planId) => {
    try {
      setLoading(true)
      await apiService.subscribe(planId)
      toast.success('Successfully subscribed to plan!')
      refreshProfile()
      fetchData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will be moved to the free plan.')) {
      return
    }

    try {
      setLoading(true)
      await apiService.cancelSubscription()
      toast.success('Subscription cancelled successfully!')
      refreshProfile()
      fetchData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = (used, total) => {
    return total > 0 ? (used / total) * 100 : 0
  }

  const getRemainingUsage = (used, total) => {
    return Math.max(0, total - used)
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead page="settings" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, subscription, and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4 hidden sm:block" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Lock className="h-4 w-4 hidden sm:block" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center space-x-2">
                <Crown className="h-4 w-4 hidden sm:block" />
                <span>Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 hidden sm:block" />
                <span>Usage</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    {errors.profile && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.profile}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input
                        id="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                        required
                      />
                    </div>

                    {errors.password && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.password}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <div className="space-y-6">
                {/* Current Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="h-5 w-5" />
                      <span>Current Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">
                          {currentPlan?.name || 'Free'} Plan
                        </div>
                        <div className="text-muted-foreground">
                          ${currentPlan?.price || 0}/month
                        </div>
                      </div>
                      {subscription?.status === 'active' && !currentPlan?.is_free && (
                        <Button
                          variant="outline"
                          onClick={handleCancelSubscription}
                          disabled={loading}
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Plans */}
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={`relative ${
                      currentPlan?.id === plan.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      {currentPlan?.id === plan.id && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          Current Plan
                        </Badge>
                      )}
                      {!plan.is_free && currentPlan?.is_free && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2" variant="secondary">
                          Recommended
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">
                            ${plan.price}
                          </span>
                          {!plan.is_free && <span className="text-muted-foreground">/month</span>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>{plan.limits.monthly_transcriptions} transcriptions/month</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>Up to {plan.limits.max_file_size_mb}MB file size</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>{plan.limits.total_prompts} custom prompts</span>
                          </li>
                        </ul>
                        
                        {currentPlan?.id !== plan.id && (
                          <Button 
                            className="w-full" 
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={loading}
                            variant={plan.is_free ? "outline" : "default"}
                          >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {plan.is_free ? 'Downgrade' : 'Upgrade'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Monitor your current usage and limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usageStats && usageStats.current_usage && usageStats.limits ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
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
                            className="h-3"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {getRemainingUsage(usageStats.current_usage.transcriptions_used, usageStats.limits.monthly_transcriptions)} remaining
                          </div>
                        </div>

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
                            className="h-3"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {getRemainingUsage(usageStats.current_usage.prompts_used, usageStats.limits.total_prompts)} remaining
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {usageStats.limits.max_file_size_mb}MB
                          </div>
                          <div className="text-sm text-muted-foreground">Max File Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {usageStats.current_usage.total_file_size_mb}MB
                          </div>
                          <div className="text-sm text-muted-foreground">Total Uploaded</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {usageStats.plan.name}
                          </div>
                          <div className="text-sm text-muted-foreground">Current Plan</div>
                        </div>
                      </div>

                      {(usageStats.remaining.percentage_used.transcriptions > 80 || 
                        usageStats.remaining.percentage_used.prompts > 80) && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            You're approaching your monthly limits. Consider upgrading your plan 
                            to avoid service interruptions.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <div>Loading usage statistics...</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
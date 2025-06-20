import { useState, useEffect } from 'react'
import { Save, Server, HardDrive } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { apiService } from '../../services/api'
import { toast } from 'sonner'

function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [systemInfo, setSystemInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAdminSettings()
      
      // Transform settings array into grouped object
      const groupedSettings = {}
      Object.keys(data.settings).forEach(category => {
        groupedSettings[category] = {}
        data.settings[category].forEach(setting => {
          groupedSettings[category][setting.key] = setting
        })
      })
      
      setSettings(groupedSettings)
      setSystemInfo(data.system_info)
    } catch (error) {
      toast.error('Failed to fetch settings: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (category, key, value, type) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          value: type === 'boolean' ? value : value
        }
      }
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      // Transform settings back to array format
      const settingsArray = []
      Object.keys(settings).forEach(category => {
        Object.keys(settings[category]).forEach(key => {
          const setting = settings[category][key]
          settingsArray.push({
            key: setting.key,
            value: setting.value,
            type: setting.type,
            description: setting.description
          })
        })
      })
      
      await apiService.updateAdminSettings(settingsArray)
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderSettingInput = (setting, category) => {
    const value = setting.value
    const onChange = (newValue) => handleSettingChange(category, setting.key, newValue, setting.type)

    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={onChange}
            />
            <Label>{setting.description}</Label>
          </div>
        )
      case 'integer':
      case 'float':
        return (
          <div className="space-y-2">
            <Label>{setting.description}</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(setting.type === 'integer' ? parseInt(e.target.value) : parseFloat(e.target.value))}
            />
          </div>
        )
      case 'array':
      case 'json':
        return (
          <div className="space-y-2">
            <Label>{setting.description}</Label>
            <Textarea
              value={Array.isArray(value) ? JSON.stringify(value, null, 2) : value}
              onChange={(e) => {
                try {
                  onChange(JSON.parse(e.target.value))
                } catch {
                  onChange(e.target.value)
                }
              }}
              rows={4}
            />
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            <Label>{setting.description}</Label>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage system configuration and preferences</p>
          </div>
          
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
              <TabsTrigger value="system">System Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage system configuration and preferences</p>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="system">System Info</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.general && Object.keys(settings.general).map(key => (
                  <div key={key}>
                    {renderSettingInput(settings.general[key], 'general')}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transcription Settings */}
          <TabsContent value="transcription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transcription Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.transcription && Object.keys(settings.transcription).map(key => (
                  <div key={key}>
                    {renderSettingInput(settings.transcription[key], 'transcription')}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Information */}
          <TabsContent value="system" className="space-y-4">
            {systemInfo && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-2">Environment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>PHP Version:</span>
                            <Badge variant="outline">{systemInfo.php_version}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Laravel Version:</span>
                            <Badge variant="outline">{systemInfo.laravel_version}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Database:</span>
                            <Badge variant="outline">{systemInfo.database_connection}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Cache Driver:</span>
                            <Badge variant="outline">{systemInfo.cache_driver}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Queue Driver:</span>
                            <Badge variant="outline">{systemInfo.queue_driver}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Upload Limits</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Max File Size:</span>
                            <span>{systemInfo.upload_limits.max_file_size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Post Max Size:</span>
                            <span>{systemInfo.upload_limits.post_max_size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Execution Time:</span>
                            <span>{systemInfo.upload_limits.max_execution_time}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Memory Limit:</span>
                            <span>{systemInfo.upload_limits.memory_limit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      Storage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold mb-2">Storage Usage</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Storage Size:</span>
                            <span>{systemInfo.disk_usage.storage_size_mb} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Public Size:</span>
                            <span>{systemInfo.disk_usage.public_size_mb} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total App Size:</span>
                            <span>{systemInfo.disk_usage.total_app_size_mb} MB</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Disk Space</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Free Space:</span>
                            <span>{systemInfo.disk_usage.free_space_gb} GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Space:</span>
                            <span>{systemInfo.disk_usage.total_space_gb} GB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Used:</span>
                            <Badge variant={systemInfo.disk_usage.used_percentage > 80 ? 'destructive' : 'outline'}>
                              {systemInfo.disk_usage.used_percentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Disk Usage Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disk Usage</span>
                        <span>{systemInfo.disk_usage.used_percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            systemInfo.disk_usage.used_percentage > 80 
                              ? 'bg-red-500' 
                              : systemInfo.disk_usage.used_percentage > 60 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${systemInfo.disk_usage.used_percentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
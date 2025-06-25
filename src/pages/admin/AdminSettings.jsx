import { useState, useEffect } from 'react'
import { Save, Server, HardDrive, Trash2, RefreshCw, CheckCircle, AlertCircle, FileText, Download, Calendar, AlertTriangle } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { apiService } from '../../services/api'
import { toast } from 'sonner'

function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [systemInfo, setSystemInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCacheType, setSelectedCacheType] = useState('all')
  const [clearingCache, setClearingCache] = useState(false)
  const [cacheResults, setCacheResults] = useState(null)
  const [logs, setLogs] = useState([])
  const [logFileInfo, setLogFileInfo] = useState(null)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [clearingLogs, setClearingLogs] = useState(false)
  const [logParams, setLogParams] = useState({
    lines: '100',
    level: 'all'
  })
  const [clearResults, setClearResults] = useState(null)

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

  const handleClearCache = async () => {
    try {
      setClearingCache(true)
      setCacheResults(null)
      
      const response = await apiService.clearCache(selectedCacheType)
      setCacheResults(response)
      
      toast.success(`${selectedCacheType === 'all' ? 'All caches' : selectedCacheType + ' cache'} cleared successfully`)
    } catch (error) {
      toast.error('Failed to clear cache: ' + error.message)
      setCacheResults({
        message: 'Cache clearing failed',
        type: selectedCacheType,
        results: {
          [selectedCacheType]: {
            status: 'error',
            message: error.message
          }
        }
      })
    } finally {
      setClearingCache(false)
    }
  }

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true)
      const params = {}
      if (logParams.lines && logParams.lines !== 'all') {
        params.lines = logParams.lines
      }
      if (logParams.level && logParams.level !== 'all') {
        params.level = logParams.level
      }
      
      const response = await apiService.getLogs(params)
      setLogs(response.logs || [])
      setLogFileInfo(response.file_info)
    } catch (error) {
      toast.error('Failed to fetch logs: ' + error.message)
    } finally {
      setLoadingLogs(false)
    }
  }

  const handleClearLogs = async () => {
    try {
      setClearingLogs(true)
      setClearResults(null)
      
      const response = await apiService.clearLogs(true)
      setClearResults(response)
      
      // Refresh logs after clearing
      setTimeout(() => {
        fetchLogs()
      }, 1000)
      
      toast.success('Logs cleared successfully')
    } catch (error) {
      toast.error('Failed to clear logs: ' + error.message)
      setClearResults({
        message: 'Log clearing failed',
        action_details: {
          cleared: false,
          error: error.message
        }
      })
    } finally {
      setClearingLogs(false)
    }
  }

  const getLogLevelColor = (level) => {
    const colors = {
      emergency: 'bg-red-600 text-white',
      alert: 'bg-red-500 text-white',
      critical: 'bg-red-400 text-white',
      error: 'bg-red-300 text-red-900',
      warning: 'bg-yellow-300 text-yellow-900',
      notice: 'bg-blue-300 text-blue-900',
      info: 'bg-green-300 text-green-900',
      debug: 'bg-gray-300 text-gray-900'
    }
    return colors[level] || 'bg-gray-200 text-gray-900'
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const cacheTypes = [
    { value: 'all', label: 'All Caches', description: 'Clears all cache types' },
    { value: 'application', label: 'Application Cache', description: 'Laravel application cache' },
    { value: 'config', label: 'Configuration Cache', description: 'Configuration cache' },
    { value: 'route', label: 'Route Cache', description: 'Route cache' },
    { value: 'view', label: 'View Cache', description: 'View cache' },
    { value: 'session', label: 'Session Cache', description: 'Session cache' },
    { value: 'online_users', label: 'Online Users Cache', description: 'Online users tracking cache' },
    { value: 'activity', label: 'Activity Cache', description: 'Activity tracking cache' },
    { value: 'compiled', label: 'Compiled Files', description: 'Compiled files (optimize:clear)' }
  ]

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
              <TabsTrigger value="cache">Cache</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
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
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
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

          {/* Cache Management */}
          <TabsContent value="cache" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Cache Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cache-type" className="text-base font-medium">Cache Type</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select which cache type to clear. Choose "All Caches" to clear everything at once.
                    </p>
                    <Select value={selectedCacheType} onValueChange={setSelectedCacheType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select cache type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cacheTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-muted-foreground">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={handleClearCache} 
                      disabled={clearingCache}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {clearingCache ? 'Clearing Cache...' : 'Clear Cache'}
                    </Button>
                    {clearingCache && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    )}
                  </div>
                </div>

                {/* Cache Results */}
                {cacheResults && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {cacheResults.message.includes('failed') ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        Cache Clear Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Operation:</span>
                          <Badge variant="outline">{cacheResults.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Timestamp:</span>
                          <span className="text-sm text-muted-foreground">
                            {cacheResults.timestamp ? new Date(cacheResults.timestamp).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        
                        {cacheResults.results && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Detailed Results:</h4>
                            <div className="space-y-2">
                              {Object.entries(cacheResults.results).map(([key, result]) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                                  <div className="flex items-center gap-2">
                                    {result.status === 'success' ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="text-sm">{result.message}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cache Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cache Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Available Cache Types:</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {cacheTypes.slice(1).map((type) => (
                            <div key={type.value} className="p-2 bg-muted rounded">
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Important Notes</h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                              <li>• Clearing cache may temporarily slow down the application while it rebuilds</li>
                              <li>• Activity and online user caches will reset real-time tracking data</li>
                              <li>• Configuration cache clearing requires the app to reload settings</li>
                              <li>• Use "All Caches" when troubleshooting performance issues</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Management */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Log Controls */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="log-lines">Number of Lines</Label>
                    <Select 
                      value={logParams.lines} 
                      onValueChange={(value) => setLogParams(prev => ({ ...prev, lines: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 lines</SelectItem>
                        <SelectItem value="100">100 lines</SelectItem>
                        <SelectItem value="200">200 lines</SelectItem>
                        <SelectItem value="500">500 lines</SelectItem>
                        <SelectItem value="1000">1000 lines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="log-level">Log Level</Label>
                    <Select 
                      value={logParams.level} 
                      onValueChange={(value) => setLogParams(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="notice">Notice</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button onClick={fetchLogs} disabled={loadingLogs} className="flex-1">
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingLogs ? 'animate-spin' : ''}`} />
                      {loadingLogs ? 'Loading...' : 'Refresh Logs'}
                    </Button>
                  </div>
                </div>

                {/* Log File Info */}
                {logFileInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Log File Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">File Path:</span>
                          <span className="text-muted-foreground font-mono text-xs">{logFileInfo.path}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">File Size:</span>
                          <span>{logFileInfo.size_mb} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Last Modified:</span>
                          <span>{logFileInfo.last_modified}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Total Entries:</span>
                          <span>{logFileInfo.total_entries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Lines Shown:</span>
                          <span>{logFileInfo.lines_requested}</span>
                        </div>
                        {logFileInfo.level_filter && logFileInfo.level_filter !== 'all' && (
                          <div className="flex justify-between">
                            <span className="font-medium">Level Filter:</span>
                            <Badge className={getLogLevelColor(logFileInfo.level_filter)}>
                              {logFileInfo.level_filter}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Clear Logs Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Trash2 className="h-4 w-4" />
                      Clear Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Clear the application log file. A backup will be created automatically before clearing.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={handleClearLogs} 
                        disabled={clearingLogs}
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {clearingLogs ? 'Clearing Logs...' : 'Clear All Logs'}
                      </Button>
                      {clearingLogs && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating backup and clearing...
                        </div>
                      )}
                    </div>

                    {/* Clear Results */}
                    {clearResults && (
                      <div className="mt-4 p-3 border rounded">
                        <div className="flex items-center gap-2 mb-2">
                          {clearResults.action_details?.cleared ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">Clear Results</span>
                        </div>
                        <div className="text-sm space-y-1">
                          {clearResults.action_details?.backup_created && (
                            <p>✓ Backup created: {clearResults.action_details.backup_path}</p>
                          )}
                          {clearResults.action_details?.cleared && (
                            <p>✓ Original size: {clearResults.action_details.original_size_mb} MB</p>
                          )}
                          {clearResults.action_details?.error && (
                            <p className="text-red-600">✗ Error: {clearResults.action_details.error}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Log Entries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Log Entries
                        {logs.length > 0 && (
                          <Badge variant="outline">{logs.length} entries</Badge>
                        )}
                      </span>
                      {logs.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Newest first
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingLogs ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-16" />
                        ))}
                      </div>
                    ) : logs.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {logs.map((log, index) => (
                          <div key={index} className="border rounded p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getLogLevelColor(log.level)}>
                                  {log.level.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {log.timestamp}
                                </span>
                              </div>
                              {log.level === 'error' || log.level === 'critical' || log.level === 'emergency' ? (
                                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              ) : null}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium mb-1 break-words overflow-wrap-anywhere">
                                {log.message}
                              </p>
                              {log.full_line !== log.message && (
                                <details className="mt-2">
                                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                    Show full log entry
                                  </summary>
                                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                    {log.full_line}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No log entries found</p>
                        <p className="text-sm">Try adjusting the filters or refreshing</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
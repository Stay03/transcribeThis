import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Progress } from '../components/ui/progress'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { 
  Upload, 
  FileAudio, 
  Loader2, 
  Copy, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { apiService } from '../services/api'
import { validateAudioFile, formatFileSize } from '../utils/fileValidation'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'

export default function TranscribePage() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [usageStats, setUsageStats] = useState(null)
  const [loadingUsage, setLoadingUsage] = useState(true)
  
  const { currentPlan, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const fetchUsageStats = async () => {
    try {
      setLoadingUsage(true)
      const response = await apiService.getUsageStats()
      setUsageStats(response.usage)
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    } finally {
      setLoadingUsage(false)
    }
  }

  useEffect(() => {
    if (currentPlan) {
      fetchUsageStats()
    }
  }, [currentPlan])

  const validateFile = (file) => {
    const maxSize = currentPlan?.limits?.max_file_size_mb || 10
    return validateAudioFile(file, maxSize)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validation = validateFile(droppedFile)
      if (validation.valid) {
        setFile(droppedFile)
        setError('')
      } else {
        setError(validation.error)
      }
    }
  }, [currentPlan])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validation = validateFile(selectedFile)
      if (validation.valid) {
        setFile(selectedFile)
        setError('')
      } else {
        setError(validation.error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await apiService.transcribeAudio(file, prompt)
      setResult(data)
      refreshProfile() // Update usage stats
      fetchUsageStats() // Refresh usage stats
      toast.success('Transcription completed successfully!')
    } catch (error) {
      setError(error.message)
      toast.error('Transcription failed')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.transcription.transcription_result)
    toast.success('Transcription copied to clipboard!')
  }

  const downloadTranscription = () => {
    const element = document.createElement('a')
    const file = new Blob([result.transcription.transcription_result], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `transcription-${result.transcription.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Transcription downloaded!')
  }


  return (
    <div className="min-h-screen bg-background">
      <SEOHead page="transcribe" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Transcribe Audio</h1>
            <p className="text-muted-foreground">
              Upload your audio file and get accurate transcription in seconds
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Audio File</CardTitle>
                <CardDescription>
                  Supports MP3, MP4, WAV, M4A, and WEBM files up to {currentPlan?.limits?.max_file_size_mb || 10}MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : file 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {file ? (
                      <div className="space-y-3">
                        <FileAudio className="h-12 w-12 text-green-500 mx-auto" />
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                        <Badge variant="secondary">Ready to transcribe</Badge>
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFile(null)}
                            type="button"
                          >
                            Select Different File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                          <div>
                            <div className="font-medium mb-1">Drop your audio file here</div>
                            <div className="text-sm text-muted-foreground">
                              or click to browse
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept=".mp3,.mp4,.wav,.m4a,.webm,audio/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>

                  {/* Prompt Input */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt">
                      Custom Prompt (Optional)
                      <Badge variant="outline" className="ml-2 text-xs">
                        Pro Tip
                      </Badge>
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., 'Transcribe this meeting and format it with speaker names' or 'Focus on technical terms and acronyms'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      maxLength={1000}
                    />
                    <div className="text-xs text-muted-foreground">
                      {prompt.length}/1000 characters
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!file || loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transcribing...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Start Transcription
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Transcription Result</CardTitle>
                <CardDescription>
                  Your transcribed text will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <div className="font-medium">Processing your audio...</div>
                    <div className="text-sm text-muted-foreground">
                      This usually takes 10-30 seconds
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">Processing Time</div>
                        <div className="text-lg font-bold text-primary">
                          {result.transcription.processing_time}s
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">File Size</div>
                        <div className="text-lg font-bold">
                          {result.transcription.file_size_mb}MB
                        </div>
                      </div>
                    </div>

                    {/* Transcription Text */}
                    <div className="space-y-2">
                      <Label>Transcription</Label>
                      <div className="min-h-32 p-4 border rounded-lg bg-background">
                        <p className="whitespace-pre-wrap">
                          {result.transcription.transcription_result}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button onClick={downloadTranscription} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => navigate('/history')} 
                        variant="outline" 
                        size="sm"
                      >
                        View All
                      </Button>
                    </div>

                    {/* Success Message */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Transcription completed successfully! 
                        {usageStats && currentPlan && (
                          <span className="ml-1">
                            You have {currentPlan.limits.monthly_transcriptions - (usageStats.current_usage?.transcriptions_used || 0)} transcriptions remaining this month.
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {!loading && !result && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div>Upload an audio file to get started</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
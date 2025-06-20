import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Alert, AlertDescription } from '../components/ui/alert'
import { 
  FileText, 
  Search, 
  Download, 
  Copy, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  HardDrive,
  Filter,
  Plus
} from 'lucide-react'
import { apiService } from '../services/api'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HistoryPage() {
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedTranscription, setSelectedTranscription] = useState(null)

  useEffect(() => {
    fetchTranscriptions()
  }, [currentPage])

  const fetchTranscriptions = async () => {
    try {
      setLoading(true)
      const data = await apiService.getTranscriptions(currentPage, 10)
      setTranscriptions(data.transcriptions || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch transcriptions:', error)
      toast.error('Failed to load transcriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this transcription?')) {
      return
    }

    try {
      await apiService.deleteTranscription(id)
      setTranscriptions(prev => prev.filter(t => t.id !== id))
      toast.success('Transcription deleted successfully')
    } catch (error) {
      toast.error('Failed to delete transcription')
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Transcription copied to clipboard!')
  }

  const handleDownload = (transcription) => {
    const element = document.createElement('a')
    const file = new Blob([transcription.transcription_result], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `transcription-${transcription.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Transcription downloaded!')
  }

  const handleViewDetails = async (id) => {
    try {
      const data = await apiService.getTranscription(id)
      setSelectedTranscription(data.transcription)
    } catch (error) {
      toast.error('Failed to load transcription details')
    }
  }

  const filteredTranscriptions = transcriptions.filter(t =>
    t.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transcription_result.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (loading && transcriptions.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Transcription History</h1>
              <p className="text-muted-foreground">
                View and manage all your transcriptions
              </p>
            </div>
            <Link to="/transcribe">
              <Button className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                New Transcription
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transcriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>

          {/* Transcriptions List */}
          {filteredTranscriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredTranscriptions.map((transcription) => (
                <Card key={transcription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-muted rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold truncate">
                              {transcription.original_filename}
                            </h3>
                            <Badge variant={getStatusColor(transcription.status)}>
                              {transcription.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transcription.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{transcription.processing_time}s</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{transcription.file_size_mb}MB</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {transcription.transcription_result}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(transcription.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(transcription.transcription_result)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(transcription)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(transcription.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transcriptions found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by uploading your first audio file'}
                </p>
                <Link to="/transcribe">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Transcription
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                disabled={currentPage === pagination.last_page}
              >
                Next
              </Button>
            </div>
          )}

          {/* Transcription Details Modal */}
          {selectedTranscription && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedTranscription.original_filename}</CardTitle>
                      <CardDescription>
                        {formatDate(selectedTranscription.created_at)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTranscription(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium">Status</div>
                      <Badge variant={getStatusColor(selectedTranscription.status)}>
                        {selectedTranscription.status}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Processing Time</div>
                      <div className="font-bold">{selectedTranscription.processing_time}s</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">File Size</div>
                      <div className="font-bold">{selectedTranscription.file_size_mb}MB</div>
                    </div>
                  </div>

                  {selectedTranscription.prompt && (
                    <div>
                      <h4 className="font-medium mb-2">Custom Prompt</h4>
                      <div className="p-3 bg-muted/30 rounded-lg text-sm">
                        {selectedTranscription.prompt}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Transcription Result</h4>
                    <div className="max-h-64 overflow-y-auto p-4 border rounded-lg bg-background">
                      <p className="whitespace-pre-wrap text-sm">
                        {selectedTranscription.transcription_result}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(selectedTranscription.transcription_result)}
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => handleDownload(selectedTranscription)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
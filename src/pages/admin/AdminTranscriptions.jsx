import { useState, useEffect } from 'react'
import { Eye, Trash2, Download } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { apiService } from '../../services/api'
import { formatDate } from '../../utils/dateFormat'
import { toast } from 'sonner'

function AdminTranscriptions() {
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1
  })
  const [selectedTranscription, setSelectedTranscription] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  useEffect(() => {
    fetchTranscriptions()
  }, [filters])

  const fetchTranscriptions = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAdminTranscriptions(filters)
      setTranscriptions(data.transcriptions)
      setPagination(data.meta)
      setStats(data.stats)
    } catch (error) {
      toast.error('Failed to fetch transcriptions: ' + error.message)
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

  const handleViewTranscription = async (transcription) => {
    try {
      const data = await apiService.getAdminTranscription(transcription.id)
      setSelectedTranscription(data.transcription)
      setIsViewDialogOpen(true)
    } catch (error) {
      toast.error('Failed to fetch transcription details: ' + error.message)
    }
  }

  const handleDeleteTranscription = async (transcriptionId) => {
    try {
      await apiService.deleteAdminTranscription(transcriptionId)
      toast.success('Transcription deleted successfully')
      fetchTranscriptions()
    } catch (error) {
      toast.error('Failed to delete transcription: ' + error.message)
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns = [
    {
      key: 'original_filename',
      title: 'File',
      render: (value, transcription) => (
        <div>
          <div className="font-medium truncate max-w-48">{value}</div>
          <div className="text-sm text-muted-foreground">
            {formatFileSize(transcription.file_size)}
          </div>
        </div>
      )
    },
    {
      key: 'user',
      title: 'User',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.name}</div>
          <div className="text-sm text-muted-foreground">{value?.email}</div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'processing_time',
      title: 'Processing Time',
      render: (value) => value ? `${value}s` : '-'
    },
    {
      key: 'created_at',
      title: 'Created',
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, transcription) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTranscription(transcription)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Transcription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{transcription.original_filename}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteTranscription(transcription.id)}>
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
      key: 'status',
      placeholder: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' }
      ]
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transcriptions</h1>
          <p className="text-muted-foreground">Manage all transcription files and processing</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <div className="text-2xl font-bold">{stats.total_transcriptions}</div>
              <p className="text-sm text-muted-foreground">Total Transcriptions</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completed_today}</div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed_today}</div>
              <p className="text-sm text-muted-foreground">Failed Today</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.processing_count}</div>
              <p className="text-sm text-muted-foreground">Currently Processing</p>
            </div>
          </div>
        )}

        <DataTable
          data={transcriptions}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search transcriptions..."
          filters={filterOptions}
        />

        {/* View Transcription Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transcription Details</DialogTitle>
            </DialogHeader>
            {selectedTranscription && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">File Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Filename:</span> {selectedTranscription.original_filename}</p>
                      <p><span className="font-medium">Size:</span> {formatFileSize(selectedTranscription.file_size)}</p>
                      <p><span className="font-medium">Status:</span> {getStatusBadge(selectedTranscription.status)}</p>
                      <p><span className="font-medium">Processing Time:</span> {selectedTranscription.processing_time}s</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">User Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedTranscription.user?.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedTranscription.user?.email}</p>
                      <p><span className="font-medium">Plan:</span> {selectedTranscription.user?.current_subscription?.plan?.name || 'No Plan'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Timestamps</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Created:</span> {formatDate(selectedTranscription.created_at)}</p>
                    {selectedTranscription.completed_at && (
                      <p><span className="font-medium">Completed:</span> {formatDate(selectedTranscription.completed_at)}</p>
                    )}
                  </div>
                </div>

                {selectedTranscription.transcript && (
                  <div>
                    <h3 className="font-semibold mb-2">Transcript</h3>
                    <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">{selectedTranscription.transcript}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminTranscriptions
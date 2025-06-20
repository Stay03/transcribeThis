import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export const useTranscriptions = (page = 1, perPage = 10) => {
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const fetchTranscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getTranscriptions(page, perPage)
      setTranscriptions(data.transcriptions || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteTranscription = async (id) => {
    try {
      await apiService.deleteTranscription(id)
      setTranscriptions(prev => prev.filter(t => t.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const addTranscription = (newTranscription) => {
    setTranscriptions(prev => [newTranscription, ...prev])
  }

  useEffect(() => {
    fetchTranscriptions()
  }, [page, perPage])

  return {
    transcriptions,
    loading,
    error,
    pagination,
    fetchTranscriptions,
    deleteTranscription,
    addTranscription
  }
}
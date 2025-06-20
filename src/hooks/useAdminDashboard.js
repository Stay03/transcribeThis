import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export function useAdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getAdminDashboardOverview()
      setOverview(data.overview)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (period = 30) => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getAdminDashboardStats(period)
      setStats(data.stats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  return {
    overview,
    stats,
    loading,
    error,
    fetchOverview,
    fetchStats,
    refetch: fetchOverview
  }
}
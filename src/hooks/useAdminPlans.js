import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export function useAdminPlans(filters = {}) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPlans = async (params = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getAdminPlans(params)
      setPlans(data.plans)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPlan = async (planData) => {
    try {
      await apiService.createAdminPlan(planData)
      await fetchPlans()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updatePlan = async (planId, planData) => {
    try {
      await apiService.updateAdminPlan(planId, planData)
      await fetchPlans()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deletePlan = async (planId) => {
    try {
      await apiService.deleteAdminPlan(planId)
      await fetchPlans()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlans
  }
}
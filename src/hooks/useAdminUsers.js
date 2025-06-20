import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export function useAdminUsers(filters = {}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [error, setError] = useState(null)

  const fetchUsers = async (params = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiService.getAdminUsers(params)
      setUsers(data.users)
      setPagination(data.meta)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      await apiService.updateAdminUser(userId, userData)
      await fetchUsers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteUser = async (userId) => {
    try {
      await apiService.deleteAdminUser(userId)
      await fetchUsers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const changeUserPlan = async (userId, planId) => {
    try {
      await apiService.changeUserPlan(userId, planId)
      await fetchUsers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    pagination,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    changeUserPlan,
    refetch: fetchUsers
  }
}
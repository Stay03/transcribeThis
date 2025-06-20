import { API_CONFIG, ERROR_MESSAGES } from '../constants/config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  getMultipartHeaders() {
    const token = localStorage.getItem('token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      switch (response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        case 403:
          throw new Error(data.error || ERROR_MESSAGES.FORBIDDEN);
        case 404:
          throw new Error(data.error || ERROR_MESSAGES.NOT_FOUND);
        case 422:
          throw new Error(data.error || ERROR_MESSAGES.VALIDATION_ERROR);
        case 429:
          throw new Error(data.error || ERROR_MESSAGES.RATE_LIMIT);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error(data.error || ERROR_MESSAGES.NETWORK_ERROR);
        default:
          throw new Error(data.error || ERROR_MESSAGES.GENERIC_ERROR);
      }
    }
    
    return data;
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Transcription endpoints
  async transcribeAudio(audioFile, prompt = '') {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    if (prompt) formData.append('prompt', prompt);

    const response = await fetch(`${this.baseURL}/transcribe`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData
    });
    return this.handleResponse(response);
  }

  async getTranscriptions(page = 1, perPage = 15) {
    const response = await fetch(`${this.baseURL}/transcriptions?page=${page}&per_page=${perPage}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getTranscription(id) {
    const response = await fetch(`${this.baseURL}/transcriptions/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteTranscription(id) {
    const response = await fetch(`${this.baseURL}/transcriptions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Subscription endpoints
  async getPlans() {
    const response = await fetch(`${this.baseURL}/plans`);
    return this.handleResponse(response);
  }

  async subscribe(planId) {
    const response = await fetch(`${this.baseURL}/subscribe`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ plan_id: planId })
    });
    return this.handleResponse(response);
  }

  async getCurrentSubscription() {
    const response = await fetch(`${this.baseURL}/subscription/current`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getUsageStats() {
    const response = await fetch(`${this.baseURL}/subscription/usage`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async cancelSubscription() {
    const response = await fetch(`${this.baseURL}/subscription/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Account management
  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/account/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async changePassword(passwordData) {
    const response = await fetch(`${this.baseURL}/account/password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    return this.handleResponse(response);
  }

  async getAccountStats() {
    const response = await fetch(`${this.baseURL}/account/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Google OAuth endpoints
  async getGoogleAuthUrl() {
    const response = await fetch(`${this.baseURL}/auth/google/redirect`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  // Dashboard
  async getAdminDashboardOverview() {
    const response = await fetch(`${this.baseURL}/admin/dashboard/overview`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminDashboardStats(period = 30) {
    const response = await fetch(`${this.baseURL}/admin/dashboard/stats?period=${period}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // User Management
  async getAdminUsers(params = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/admin/users?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminUser(id) {
    const response = await fetch(`${this.baseURL}/admin/users/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateAdminUser(id, userData) {
    const response = await fetch(`${this.baseURL}/admin/users/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async deleteAdminUser(id) {
    const response = await fetch(`${this.baseURL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async changeUserPlan(userId, planId) {
    const response = await fetch(`${this.baseURL}/admin/users/${userId}/change-plan`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ plan_id: planId })
    });
    return this.handleResponse(response);
  }

  // Plan Management
  async getAdminPlans(params = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/admin/plans?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminPlan(id) {
    const response = await fetch(`${this.baseURL}/admin/plans/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createAdminPlan(planData) {
    const response = await fetch(`${this.baseURL}/admin/plans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(planData)
    });
    return this.handleResponse(response);
  }

  async updateAdminPlan(id, planData) {
    const response = await fetch(`${this.baseURL}/admin/plans/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(planData)
    });
    return this.handleResponse(response);
  }

  async deleteAdminPlan(id) {
    const response = await fetch(`${this.baseURL}/admin/plans/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Transcription Management
  async getAdminTranscriptions(params = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/admin/transcriptions?${searchParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminTranscription(id) {
    const response = await fetch(`${this.baseURL}/admin/transcriptions/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteAdminTranscription(id) {
    const response = await fetch(`${this.baseURL}/admin/transcriptions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // System Settings
  async getAdminSettings() {
    const response = await fetch(`${this.baseURL}/admin/settings`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateAdminSettings(settings) {
    const response = await fetch(`${this.baseURL}/admin/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ settings })
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);

  const login = async (email, password) => {
    try {
      const data = await apiService.login({ email, password });
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('token', data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const data = await apiService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('token', data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setCurrentPlan(null);
      localStorage.removeItem('token');
    }
  };

  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.getProfile();
      setUser(data.user);
      setCurrentPlan(data.current_plan);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await apiService.updateProfile(profileData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = () => {
    if (token) {
      fetchProfile();
    }
  };

  const loginWithGoogle = async () => {
    try {
      const data = await apiService.getGoogleAuthUrl();
      window.location.href = data.redirect_url;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const setAuthFromOAuth = (token, user) => {
    setToken(token);
    setUser(user);
    setCurrentPlan(user.current_plan || null);
    localStorage.setItem('token', token);
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const value = {
    user,
    token,
    currentPlan,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    loginWithGoogle,
    setAuthFromOAuth,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
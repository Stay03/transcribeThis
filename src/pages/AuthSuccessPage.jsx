import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Loader2, Mic, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AuthSuccessPage() {
  const [status, setStatus] = useState('processing')
  const { setAuthFromOAuth } = useAuth()
  const navigate = useNavigate()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return

    const processSuccess = async () => {
      hasProcessed.current = true
      
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const userData = urlParams.get('user')
        
        if (!token || !userData) {
          throw new Error('Missing authentication data')
        }

        // Decode base64 user data
        const user = JSON.parse(atob(userData))
        
        // Set authentication in context
        setAuthFromOAuth(token, user)
        
        setStatus('success')
        toast.success('Successfully signed in with Google!')
        
        // Clean up URL and redirect
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)
        
      } catch (error) {
        console.error('Auth success processing error:', error)
        toast.error('Authentication failed')
        navigate('/login', { replace: true })
      }
    }

    processSuccess()
  }, [setAuthFromOAuth, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Mic className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">TranscribeThis</span>
        </div>

        <Card>
          {status === 'processing' ? (
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <CardTitle>Completing sign in...</CardTitle>
              <CardDescription>
                Please wait while we finish setting up your account
              </CardDescription>
            </CardHeader>
          ) : (
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-green-700">Success!</CardTitle>
              <CardDescription>
                You've been successfully signed in. Redirecting to your dashboard...
              </CardDescription>
            </CardHeader>
          )}
        </Card>
      </div>
    </div>
  )
}
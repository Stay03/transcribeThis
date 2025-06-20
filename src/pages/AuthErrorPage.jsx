import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { AlertCircle, Mic } from 'lucide-react'

export default function AuthErrorPage() {
  const [error, setError] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('message') || 'Authentication failed'
    const details = urlParams.get('error') || ''
    
    setError(message)
    setErrorDetails(details)
  }, [])

  const handleRetry = () => {
    navigate('/login', { replace: true })
  }

  const handleSignup = () => {
    navigate('/signup', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Mic className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">TranscribeThis</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-red-700">Sign in failed</CardTitle>
            <CardDescription>
              There was a problem signing you in with Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
                {errorDetails && (
                  <div className="mt-2 text-sm opacity-75">
                    {errorDetails}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Try signing in again
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignup}
                className="w-full"
              >
                Create account with email
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact support at{' '}
            <a href="mailto:support@transcribethis.app" className="text-primary hover:underline">
              support@transcribethis.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
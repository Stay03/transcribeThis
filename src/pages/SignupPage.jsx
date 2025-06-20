import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { GoogleButton } from '../components/ui/google-button'
import { Loader2, Mic, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import SEOHead from '../components/SEOHead'
import logoImage from '../assets/logo.png'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    )
    
    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/transcribe')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError('')
    
    const result = await loginWithGoogle()
    
    if (result && !result.success) {
      setError(result.error)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <SEOHead page="signup" />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <img src={logoImage} alt="TranscribeThis Logo" className=" w-8" />
          <span className="text-2xl font-bold">TranscribeThis</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start transcribing with 10 free transcriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Benefits */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What you get for free:</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  10 transcriptions per month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Up to 10MB file size
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Multiple file formats
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Custom prompts
                </li>
              </ul>
            </div>

            <GoogleButton 
              onClick={handleGoogleSignup} 
              loading={googleLoading}
              className="w-full mb-4"
            >
              Sign up with Google
            </GoogleButton>
            
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline">Privacy Policy</a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { CheckCircle, Mic, Zap, Shield, ArrowRight, Users, Star, Clock, FileText, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import SEOHead from '../components/SEOHead'
import logoImage from '../assets/logo.png'

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const [plans, setPlans] = useState([])
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await apiService.getPlans()
        setPlans(data.plans || [])
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      }
    }
    fetchPlans()
  }, [])

  const faqData = [
    {
      question: "What transcription formats do you support?",
      answer: "We offer three specialized formats: Verbatim (word-for-word exact transcription including filler words), Subtitle format (time-coded for video captions), and Readable format (clean, formatted text with proper punctuation). Each format is optimized for different use cases."
    },
    {
      question: "How fast is your AI transcription service?",
      answer: "Our lightning-fast AI processes most audio files in seconds, not hours. A typical 10-minute audio file is transcribed in under 30 seconds with 99% accuracy. Processing speed depends on file length and complexity."
    },
    {
      question: "What audio file formats do you accept?",
      answer: "We support all major audio formats including MP3, WAV, M4A, MP4, and WebM files. Maximum file sizes vary by plan: 10MB (Free), 50MB (Pro), and 100MB (Enterprise)."
    },
    {
      question: "How accurate is your speech-to-text conversion?",
      answer: "Our AI-powered transcription achieves 99% accuracy for clear audio with minimal background noise. Accuracy may vary based on audio quality, accents, and technical terminology. Our custom prompts feature helps improve accuracy for specialized content."
    },
    {
      question: "Can I use custom prompts for better transcription?",
      answer: "Yes! Custom prompts help our AI understand context and terminology specific to your industry. For example, prompts like 'Focus on medical terminology' or 'Include speaker names' significantly improve transcription quality."
    },
    {
      question: "Is my audio data secure and private?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption. Audio files are processed securely and automatically deleted after transcription. We never store or share your content."
    }
  ]

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen">
      <SEOHead page="home" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="TranscribeThis Logo" className=" w-8" />
            <span className="text-xl font-bold">TranscribeThis</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>My Account</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button>Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 Powered by Advanced AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Audio to Text with{' '}
            <span className="text-primary">Lightning Speed</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional AI transcription service that converts your audio files to accurate text 
            in seconds. Perfect for meetings, interviews, podcasts, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isAuthenticated ? "/transcribe" : "/signup"} className="w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                {isAuthenticated ? "Transcribe Now" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 10 free transcriptions
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TranscribeThis?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets professional-grade accuracy for all your transcription needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Get your transcriptions in seconds, not hours. Our AI processes audio files 
                  up to 10x faster than traditional methods.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>99% Accuracy</CardTitle>
                <CardDescription>
                  State-of-the-art AI models ensure your transcriptions are precise and reliable, 
                  with support for multiple languages and accents.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Professional Grade</CardTitle>
                <CardDescription>
                  Built for professionals who demand quality. Secure, private, and compliant 
                  with industry standards.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works for you. Start free, upgrade when you're ready.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.name?.toLowerCase() === 'pro' ? 'border-primary shadow-lg' : ''}`}>
                {plan.name?.toLowerCase() === 'pro' && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    {!plan.is_free && <span className="text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{plan.limits.monthly_transcriptions} transcriptions/month</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Up to {plan.limits.max_file_size_mb}MB file size</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{plan.limits.total_prompts} custom prompts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Multiple file formats</span>
                    </li>
                    {!plan.is_free && (
                      <>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span>Priority processing</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span>Email support</span>
                        </li>
                      </>
                    )}
                  </ul>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full" variant={plan.is_free ? "outline" : "default"}>
                      {plan.is_free ? 'Start Free' : 'Get Started'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transcription Formats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Multiple Transcription Formats for Every Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from three specialized formats: verbatim word-for-word accuracy, 
              subtitle timing for videos, or readable clean formatting. Our AI adapts to your specific requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Complete Verbatim Transcription</CardTitle>
                <CardDescription>
                  Exact word-for-word transcription including filler words, pauses, and natural speech patterns. 
                  Perfect for legal proceedings, research interviews, and detailed analysis where every word matters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-3">Most Accurate</Badge>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Includes "um," "uh," and pauses</li>
                  <li>• False starts and corrections</li>
                  <li>• Speaker identification</li>
                  <li>• Legal and research standard</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Readable Verbatim Transcription</CardTitle>
                <CardDescription>
                  Clean, word-for-word transcription with improved readability and proper formatting. 
                  Removes filler words while maintaining accuracy for professional documentation and content creation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-3">Professional</Badge>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Clean formatting</li>
                  <li>• Removes filler words</li>
                  <li>• Maintains accuracy</li>
                  <li>• Professional output</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Meeting Note</CardTitle>
                <CardDescription>
                  Structured summary format that captures key points, action items, and decisions. 
                  Organized with clear sections and bullet points for easy review and distribution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-3">Structured</Badge>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Key points extraction</li>
                  <li>• Action items highlighted</li>
                  <li>• Decision tracking</li>
                  <li>• Meeting-ready format</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Professionals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "TranscribeThis has revolutionized how we handle meeting notes. 
                  The accuracy is incredible and saves us hours every week."
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Product Manager</div>
              </CardContent>
            </Card>
            
            <Card className="border-0">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a journalist, I need fast and accurate transcriptions. 
                  This tool delivers every time. Highly recommended!"
                </p>
                <div className="font-semibold">Mike Chen</div>
                <div className="text-sm text-muted-foreground">Senior Journalist</div>
              </CardContent>
            </Card>
            
            <Card className="border-0">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Perfect for our podcast workflow. The custom prompts feature 
                  helps us get exactly the format we need."
                </p>
                <div className="font-semibold">Emily Rodriguez</div>
                <div className="text-sm text-muted-foreground">Podcast Producer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers about our lightning-fast transcription service, accuracy rates, and supported formats.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="border">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {expandedFAQ === index && (
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Audio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust TranscribeThis for their transcription needs.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src={logoImage} alt="TranscribeThis Logo" className="h-6 w-6" />
              <span className="text-lg font-bold">TranscribeThis</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 TranscribeThis. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
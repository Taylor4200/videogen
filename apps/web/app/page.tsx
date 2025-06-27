import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Zap, TrendingUp, Users, Clock, CheckCircle, Youtube, Cloud, ShieldCheck, Star } from 'lucide-react'
import Link from 'next/link'

const testimonials = [
  {
    name: 'Alex Chen',
    title: 'YouTube Creator',
    quote: 'This platform cut my video production time by 90%. The AI scripts and voiceovers are next-level!',
    avatar: '/avatars/alex.png',
  },
  {
    name: 'Maria Gomez',
    title: 'Marketing Lead, Growthly',
    quote: 'We scaled our channel and doubled engagement. The analytics and scheduling are a game changer.',
    avatar: '/avatars/maria.png',
  },
  {
    name: 'Samir Patel',
    title: 'Agency Owner',
    quote: 'My team collaborates and delivers for clients faster than ever. The YouTube integration is seamless.',
    avatar: '/avatars/samir.png',
  },
]

const logos = [
  { src: '/logos/youtube.svg', alt: 'YouTube' },
  { src: '/logos/aws.svg', alt: 'Amazon Web Services' },
  { src: '/logos/stripe.svg', alt: 'Stripe' },
  { src: '/logos/google.svg', alt: 'Google' },
  { src: '/logos/capterra.svg', alt: 'Capterra' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#181A20] dark:to-[#23263A]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 AI-Powered Video Creation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-foreground">Create & Publish</span>
              <span className="gradient-text block">YouTube Videos Automatically</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Instantly generate scripts, voiceovers, and videos with AI. Schedule and publish to YouTube in one click. For creators, marketers, and agencies who want to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="button-primary">
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="button-secondary bg-white text-gray-900 dark:bg-[#23263A] dark:text-white border dark:border-gray-700">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10 opacity-80">
              {logos.map((logo) => (
                <img key={logo.src} src={logo.src} alt={logo.alt} className="h-8 grayscale hover:grayscale-0 transition duration-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Automate Your YouTube Workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to go from idea to published video—10x faster, with AI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Script Generation</CardTitle>
                <CardDescription>
                  Generate engaging scripts in seconds for any niche or topic.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Professional Voiceovers</CardTitle>
                <CardDescription>
                  Studio-quality AI voices in multiple languages and styles.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Youtube className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>1-Click YouTube Publishing</CardTitle>
                <CardDescription>
                  Schedule and publish videos directly to your channel.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Save Hours Daily</CardTitle>
                <CardDescription>
                  What used to take hours now takes minutes. Focus on growth.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Invite your team, share projects, and manage multiple channels.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track performance, analyze trends, and optimize your content.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#181A20] dark:to-[#23263A] text-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="rounded-xl overflow-hidden shadow-lg aspect-video bg-black flex items-center justify-center">
              {/* Replace with real video embed */}
              <span className="text-white text-2xl">[Product Demo Video]</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4">See It In Action</h3>
            <p className="text-lg text-muted-foreground mb-6">Watch how you can go from idea to published YouTube video in minutes—not hours.</p>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Generate scripts & voiceovers with AI</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Auto-generate video & thumbnail</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Schedule & publish to YouTube</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Track analytics & optimize</li>
            </ul>
            <Button asChild className="button-primary">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations & Trust Section */}
      <section className="py-16 bg-background text-foreground border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-10 items-center mb-10">
            <div className="flex items-center gap-2"><Youtube className="h-6 w-6 text-red-600" /> YouTube</div>
            <div className="flex items-center gap-2"><Cloud className="h-6 w-6 text-blue-600" /> AWS S3</div>
            <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-green-600" /> Secure & Compliant</div>
            <div className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> 4.9/5 on Capterra</div>
            <div className="flex items-center gap-2"><img src="/logos/stripe.svg" alt="Stripe" className="h-6" /> Stripe</div>
          </div>
          <div className="text-center text-lg text-muted-foreground">Trusted by creators, agencies, and brands worldwide.</div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#181A20] dark:to-[#23263A] text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">What Our Users Say</h3>
            <p className="text-lg text-muted-foreground">Join thousands of creators and teams who trust us to power their YouTube growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 flex flex-col items-center text-center">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-blue-200" />
                <div className="font-semibold mb-1">{t.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{t.title}</div>
                <div className="italic text-gray-700 mb-2">“{t.quote}”</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-blue-600 text-white text-center dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Video Creation?</h2>
          <p className="text-lg mb-8">Start your free trial and see how easy it is to automate your YouTube channel.</p>
          <Button asChild size="lg" className="button-primary bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-700 dark:text-white">
            <Link href="/auth/signup" className="text-white">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 
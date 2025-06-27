import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Plus, Video, Calendar, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
          <p className="text-muted-foreground">Your AI-powered video creation hub</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="button-primary">
            <Link href="/video-generator">
              <Plus className="mr-2 h-5 w-5" /> New Video
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">
              Upgrade Plan <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      {/* Credit Balance */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Credit Balance</CardTitle>
            <CardDescription>Available credits for video generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold">87</span>
              <Badge variant="secondary">Pro Plan</Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Renewal: July 31, 2025</div>
          </CardContent>
        </Card>
        <Card className="col-span-2 flex flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <div>
            <div className="text-lg font-semibold mb-1">Generate your next video in seconds</div>
            <div className="text-muted-foreground mb-2">AI script, voiceover, and YouTube upload in one click.</div>
            <Button asChild className="button-primary">
              <Link href="/video-generator">
                <Plus className="mr-2 h-5 w-5" /> Start Now
              </Link>
            </Button>
          </div>
          <Video className="h-16 w-16 text-blue-500 hidden md:block" />
        </Card>
      </div>
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-2xl font-bold">5</span>
            <span className="text-xs text-muted-foreground">Videos this week</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-2xl font-bold">1,230</span>
            <span className="text-xs text-muted-foreground">Total views</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-2xl font-bold">98</span>
            <span className="text-xs text-muted-foreground">Subscribers</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-2xl font-bold">3</span>
            <span className="text-xs text-muted-foreground">Scheduled videos</span>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-muted rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 text-blue-500" />
            <span>Video <b>"How to Use AI for YouTube"</b> published</span>
            <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-green-500" />
            <span>Video <b>"Top 5 AI Tools"</b> scheduled for July 5</span>
            <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart2 className="h-4 w-4 text-purple-500" />
            <span>Analytics updated for <b>"Viral Shorts"</b></span>
            <span className="ml-auto text-xs text-muted-foreground">3d ago</span>
          </div>
        </div>
      </div>
    </div>
  )
} 
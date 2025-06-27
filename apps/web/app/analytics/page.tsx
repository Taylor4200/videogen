import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart2, TrendingUp, Eye, ThumbsUp } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your YouTube performance and optimize your content strategy.</p>
      </div>
      {/* Summary cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
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
            <span className="text-2xl font-bold">320</span>
            <span className="text-xs text-muted-foreground">Likes</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <span className="text-2xl font-bold">12</span>
            <span className="text-xs text-muted-foreground">Videos this month</span>
          </CardContent>
        </Card>
      </div>
      {/* Chart area placeholder */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
          <CardDescription>Views, likes, and engagement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <BarChart2 className="h-10 w-10 mr-2" />
            <span>Chart UI coming soon</span>
          </div>
        </CardContent>
      </Card>
      {/* Recent performance placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Performance</h2>
        <div className="bg-muted rounded-lg p-4 flex flex-col gap-3 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>"How to Use AI for YouTube" gained 120 views this week.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-blue-500" />
            <span>"Top 5 AI Tools" reached 1,000 total views.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp className="h-4 w-4 text-purple-500" />
            <span>"Viral Shorts" received 30 new likes.</span>
          </div>
        </div>
      </div>
    </div>
  )
} 
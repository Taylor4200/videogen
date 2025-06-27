import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Schedule Manager</h1>
        <Button asChild className="button-primary">
          <Link href="/video-generator">
            <Plus className="mr-2 h-5 w-5" /> New Scheduled Video
          </Link>
        </Button>
      </div>
      {/* Calendar grid placeholder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View and manage your upcoming video posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <Calendar className="h-10 w-10 mr-2" />
            <span>Calendar UI coming soon</span>
          </div>
        </CardContent>
      </Card>
      {/* Scheduled videos list placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Scheduled Videos</h2>
        <div className="bg-muted rounded-lg p-4 flex flex-col gap-3 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>No scheduled videos yet.</span>
          </div>
        </div>
      </div>
    </div>
  )
} 
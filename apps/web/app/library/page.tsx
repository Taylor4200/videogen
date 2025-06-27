import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { Plus, Search, Video, FileText, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

const scripts = [] // Replace with real data
const videos = [] // Replace with real data
const thumbnails = [] // Replace with real data

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Content Library</h1>
        <div className="flex gap-2">
          <Button asChild className="button-primary">
            <Link href="/video-generator">
              <Plus className="mr-2 h-5 w-5" /> New Video
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="scripts" className="mb-6">
        <TabsList className="flex gap-4 border-b border-border mb-4 bg-transparent p-0">
          <TabsTrigger value="scripts" className="px-4 py-2 font-medium">Scripts</TabsTrigger>
          <TabsTrigger value="videos" className="px-4 py-2 font-medium">Videos</TabsTrigger>
          <TabsTrigger value="thumbnails" className="px-4 py-2 font-medium">Thumbnails</TabsTrigger>
        </TabsList>
        <div className="mb-6 flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <input className="input-field pl-10" placeholder="Search..." />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <TabsContent value="scripts">
          {scripts.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <FileText className="mx-auto h-10 w-10 mb-4 text-muted-foreground" />
              <div className="mb-2 font-semibold">No scripts found</div>
              <div className="mb-4">Generate your first script to get started.</div>
              <Button asChild className="button-primary">
                <Link href="/video-generator">Generate Script</Link>
              </Button>
            </div>
          ) : (
            <div>/* Render scripts grid/list here */</div>
          )}
        </TabsContent>
        <TabsContent value="videos">
          {videos.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <Video className="mx-auto h-10 w-10 mb-4 text-muted-foreground" />
              <div className="mb-2 font-semibold">No videos found</div>
              <div className="mb-4">Generate your first video to get started.</div>
              <Button asChild className="button-primary">
                <Link href="/video-generator">Generate Video</Link>
              </Button>
            </div>
          ) : (
            <div>/* Render videos grid/list here */</div>
          )}
        </TabsContent>
        <TabsContent value="thumbnails">
          {thumbnails.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <ImageIcon className="mx-auto h-10 w-10 mb-4 text-muted-foreground" />
              <div className="mb-2 font-semibold">No thumbnails found</div>
              <div className="mb-4">Generate your first thumbnail to get started.</div>
              <Button asChild className="button-primary">
                <Link href="/video-generator">Generate Thumbnail</Link>
              </Button>
            </div>
          ) : (
            <div>/* Render thumbnails grid/list here */</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 
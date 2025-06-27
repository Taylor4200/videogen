import Link from 'next/link'
import { Github, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-white/80 dark:bg-black/80 py-8 mt-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 text-lg font-semibold gradient-text">
          <span role="img" aria-label="logo">🎬</span> VideoSaaS
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/yourusername/video-saas-platform" target="_blank" rel="noopener" aria-label="GitHub" className="hover:text-primary">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener" aria-label="YouTube" className="hover:text-primary">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="container mx-auto text-center text-xs text-muted-foreground mt-4">
        &copy; {new Date().getFullYear()} VideoSaaS. All rights reserved.
      </div>
    </footer>
  )
} 
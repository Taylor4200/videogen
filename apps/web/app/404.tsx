import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted text-center">
      <div className="text-7xl font-extrabold text-primary mb-4">404</div>
      <div className="text-2xl font-bold mb-2">Page not found</div>
      <div className="text-muted-foreground mb-6">Sorry, we couldn't find the page you're looking for.</div>
      <Button asChild className="button-primary">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
} 
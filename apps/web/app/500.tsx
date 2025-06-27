import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted text-center">
      <div className="text-7xl font-extrabold text-primary mb-4">500</div>
      <div className="text-2xl font-bold mb-2">Internal Server Error</div>
      <div className="text-muted-foreground mb-6">Something went wrong. Please try again later.</div>
      <Button asChild className="button-primary">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
} 
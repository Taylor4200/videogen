import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
          <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <input className="input-field" type="email" placeholder="Email address" />
          <Button className="button-primary w-full">Send Reset Link</Button>
          <div className="flex justify-between text-xs mt-2">
            <Link href="/auth/signin" className="text-primary hover:underline">Back to sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
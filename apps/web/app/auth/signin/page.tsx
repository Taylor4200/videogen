import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'
import { SiYoutubemusic } from 'react-icons/si'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>Welcome back! Choose a sign-in method below.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button variant="outline" className="flex items-center gap-2 justify-center">
            <FcGoogle className="h-5 w-5" /> Sign in with Google
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center">
            <SiYoutubemusic className="h-5 w-5 text-red-500" /> Sign in with YouTube
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <input className="input-field" type="email" placeholder="Email address" />
          <input className="input-field" type="password" placeholder="Password" />
          <Button className="button-primary w-full">Sign In</Button>
          <Button variant="ghost" className="w-full">Send Magic Link</Button>
          <div className="flex justify-between text-xs mt-2">
            <Link href="/auth/forgot" className="text-primary hover:underline">Forgot password?</Link>
            <Link href="/auth/signup" className="text-primary hover:underline">Create account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Key, Mic } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Taylor</div>
                  <div className="text-xs text-muted-foreground">taylor@email.com</div>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
        {/* Voice Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Selection</CardTitle>
            <CardDescription>Choose your preferred AI voice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Mic className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">en-US-Neural2-F</div>
                  <div className="text-xs text-muted-foreground">Default voice</div>
                </div>
              </div>
              <Button variant="outline">Change Voice</Button>
            </div>
          </CardContent>
        </Card>
        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Pro Plan</div>
                  <div className="text-xs text-muted-foreground">Renews July 31, 2025</div>
                </div>
              </div>
              <Button asChild className="button-primary">
                <a href="/pricing">Manage Billing</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Access for integrations and automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Key className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">sk-************</div>
                  <div className="text-xs text-muted-foreground">Last used: 2 days ago</div>
                </div>
              </div>
              <Button variant="outline">Regenerate Key</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
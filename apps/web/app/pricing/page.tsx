'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Star, ShieldCheck, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const plans = [
  {
    name: 'Starter',
    priceMonthly: 19,
    priceAnnual: 14.25,
    credits: 20,
    features: [
      'Multi-platform publishing (up to 2)',
      'Watermark control',
      'Basic analytics',
      'Single-user',
      'Limited cloud storage',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    priceMonthly: 59,
    priceAnnual: 44.25,
    credits: 100,
    features: [
      'Bulk upload',
      'Unlimited multi-platform publishing',
      'Priority support',
      'Advanced analytics',
      'More storage',
      'Scheduled publishing',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Agency',
    priceMonthly: 149,
    priceAnnual: 111.75,
    credits: 300,
    features: [
      'API access',
      'Teams',
      'White-label',
      'Premium support',
      'Custom SLAs',
    ],
    cta: 'Get Started',
    highlight: false,
  },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes! You can start with a free trial and explore all features before upgrading.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. You can cancel your subscription at any time from your account settings.'
  },
  {
    q: 'What happens if I run out of credits?',
    a: 'You can purchase additional credits or upgrade your plan at any time.'
  },
  {
    q: 'Do you offer team or agency plans?',
    a: 'Yes, our Agency plan is built for teams and agencies, with collaboration and white-label options.'
  },
  {
    q: 'Is my data secure?',
    a: 'We use industry-leading security and encryption. Your data is always protected.'
  },
]

const features = [
  { label: 'Watermark control', starter: true, pro: true, agency: true },
  { label: 'Multi-platform publishing', starter: true, pro: true, agency: true, starterNote: 'Up to 2' },
  { label: 'Bulk upload', starter: false, pro: true, agency: true },
  { label: 'Advanced analytics', starter: false, pro: true, agency: true },
  { label: 'Scheduled publishing', starter: false, pro: true, agency: true },
  { label: 'Priority support', starter: false, pro: true, agency: true },
  { label: 'Teams', starter: false, pro: false, agency: true },
  { label: 'API access', starter: false, pro: false, agency: true },
  { label: 'White-label', starter: false, pro: false, agency: true },
  { label: 'Custom SLAs', starter: false, pro: false, agency: true },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. No hidden fees, cancel anytime.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button variant={annual ? 'default' : 'outline'} onClick={() => setAnnual(true)}>
            Annual <span className="ml-2 text-xs text-green-600">Save 25%</span>
          </Button>
          <Button variant={!annual ? 'default' : 'outline'} onClick={() => setAnnual(false)}>
            Monthly
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.highlight ? 'border-2 border-blue-500 shadow-lg scale-105 z-10' : ''}`}>
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold">
                ${annual ? plan.priceAnnual : plan.priceMonthly}
                <span className="text-lg text-gray-500">/mo</span>
              </div>
              <CardDescription>{plan.credits} credits/month</CardDescription>
              {annual && <div className="text-green-600 text-xs mt-1">Billed annually</div>}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.highlight ? 'button-primary' : ''}`} variant={plan.highlight ? 'default' : 'outline'} asChild>
                <Link href={plan.name === 'Agency' ? '/contact' : '/auth/signup'}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Feature Comparison Table */}
      <div className="overflow-x-auto max-w-5xl mx-auto mb-16">
        <table className="min-w-full border rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold">Features</th>
              <th className="py-3 px-4 text-center">Starter</th>
              <th className="py-3 px-4 text-center">Pro</th>
              <th className="py-3 px-4 text-center">Agency</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.label} className="border-t">
                <td className="py-2 px-4">{f.label}</td>
                <td className="py-2 px-4 text-center">
                  {f.starter ? (
                    <>
                      <CheckCircle className="inline h-5 w-5 text-green-500" />
                      {f.starterNote && (
                        <span className="block text-xs text-muted-foreground">{f.starterNote}</span>
                      )}
                    </>
                  ) : (
                    '-')
                  }
                </td>
                <td className="py-2 px-4 text-center">{f.pro ? <CheckCircle className="inline h-5 w-5 text-green-500" /> : '-'}</td>
                <td className="py-2 px-4 text-center">{f.agency ? <CheckCircle className="inline h-5 w-5 text-green-500" /> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Trust & Social Proof */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        <div className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> 4.9/5 on Capterra</div>
        <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-green-600" /> Secure & Compliant</div>
        <div className="flex items-center gap-2"><Users className="h-6 w-6 text-blue-600" /> Trusted by creators</div>
      </div>
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="font-semibold mb-2">{faq.q}</div>
              <div className="text-muted-foreground">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-8">
        All plans include unlimited projects, secure cloud storage, and access to all future updates.
      </div>
    </div>
  )
} 
import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { prisma } from '../lib/prisma'
import { CreditService } from '../services/creditService'
import { createError } from '../middleware/errorHandler'

const router = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Create checkout session
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { priceId, credits } = req.body

    if (!priceId || !credits) {
      throw createError('Price ID and credits required', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        credits: credits.toString(),
      },
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    throw error
  }
})

// Create subscription
router.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { priceId, credits } = req.body

    if (!priceId || !credits) {
      throw createError('Price ID and credits required', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      })
      customerId = customer.id
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
        credits: credits.toString(),
      },
    })

    res.json({ subscriptionId: subscription.id })
  } catch (error) {
    throw error
  }
})

// Stripe webhook
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send(`Webhook Error: ${err}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        if (session.metadata?.userId && session.metadata?.credits) {
          await CreditService.addCredits({
            userId: session.metadata.userId,
            amount: parseInt(session.metadata.credits),
            type: 'PURCHASE',
            description: 'Credit purchase',
            stripePaymentIntentId: session.payment_intent as string,
          })
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          if (subscription.metadata?.userId && subscription.metadata?.credits) {
            await CreditService.addCredits({
              userId: subscription.metadata.userId,
              amount: parseInt(subscription.metadata.credits),
              type: 'SUBSCRIPTION',
              description: 'Monthly subscription credits',
            })
          }
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        if (deletedSubscription.metadata?.userId) {
          await prisma.user.update({
            where: { id: deletedSubscription.metadata.userId },
            data: { subscriptionStatus: 'CANCELED' }
          })
        }
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export { router as stripeRouter } 
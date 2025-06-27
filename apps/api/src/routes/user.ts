import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { CreditService } from '../services/creditService'
import { createError } from '../middleware/errorHandler'
import { z } from 'zod'

const router = Router()

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  voicePreference: z.string().optional(),
  niche: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        creditBalance: true,
        subscriptionStatus: true,
        voicePreference: true,
        niche: true,
        keywords: true,
        createdAt: true,
      }
    })

    res.json({ user })
  } catch (error) {
    throw error
  }
})

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const updates = updateProfileSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        name: true,
        creditBalance: true,
        subscriptionStatus: true,
        voicePreference: true,
        niche: true,
        keywords: true,
      }
    })

    res.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Get credit balance
router.get('/credits', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const balance = await CreditService.getBalance(userId)
    
    res.json({ balance })
  } catch (error) {
    throw error
  }
})

// Get credit history
router.get('/credits/history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { limit = 50, offset = 0 } = req.query
    
    const history = await CreditService.getTransactionHistory(
      userId,
      parseInt(limit as string),
      parseInt(offset as string)
    )
    
    res.json({ history })
  } catch (error) {
    throw error
  }
})

export { router as userRouter } 
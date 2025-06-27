import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { CreditService } from '../services/creditService'
import { addJob, scriptQueue } from '../lib/queue'
import { JobType } from '@prisma/client'
import { createError } from '../middleware/errorHandler'
import { z } from 'zod'

const router = Router()

const generateScriptSchema = z.object({
  niche: z.string().min(1),
  keywords: z.array(z.string()).min(1),
  length: z.number().min(30).max(1800), // 30 seconds to 30 minutes
  title: z.string().optional(),
})

const updateScriptSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

// Generate script
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const data = generateScriptSchema.parse(req.body)

    // Check credits (1 credit per script)
    const hasCredits = await CreditService.hasEnoughCredits(userId, 1)
    if (!hasCredits) {
      throw createError('Insufficient credits', 402)
    }

    // Deduct credits
    await CreditService.deductCredits(userId, 1, 'Script generation')

    // Add to queue
    const job = await addJob(scriptQueue, JobType.SCRIPT_GENERATION, {
      userId,
      ...data,
    })

    res.json({
      jobId: job.id,
      message: 'Script generation started',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Get user scripts
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { limit = 20, offset = 0 } = req.query

    const scripts = await prisma.script.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    res.json({ scripts })
  } catch (error) {
    throw error
  }
})

// Get script by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params

    const script = await prisma.script.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!script) {
      throw createError('Script not found', 404)
    }

    res.json({ script })
  } catch (error) {
    throw error
  }
})

// Update script
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params
    const updates = updateScriptSchema.parse(req.body)

    const script = await prisma.script.updateMany({
      where: {
        id,
        userId,
      },
      data: updates,
    })

    res.json({ message: 'Script updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Delete script
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params

    await prisma.script.deleteMany({
      where: {
        id,
        userId,
      },
    })

    res.json({ message: 'Script deleted successfully' })
  } catch (error) {
    throw error
  }
})

export { router as scriptRouter } 
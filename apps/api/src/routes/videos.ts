import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { CreditService } from '../services/creditService'
import { addJob, audioQueue, videoQueue, thumbnailQueue } from '../lib/queue'
import { JobType } from '@prisma/client'
import { createError } from '../middleware/errorHandler'
import { z } from 'zod'

const router = Router()

const generateVideoSchema = z.object({
  scriptId: z.string(),
  style: z.enum(['modern', 'minimal', 'dynamic']).optional(),
  thumbnailStyle: z.enum(['clickbait', 'professional', 'minimal']).optional(),
})

// Generate video from script
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const data = generateVideoSchema.parse(req.body)

    // Check credits (3 credits per video: audio + video + thumbnail)
    const hasCredits = await CreditService.hasEnoughCredits(userId, 3)
    if (!hasCredits) {
      throw createError('Insufficient credits', 402)
    }

    // Deduct credits
    await CreditService.deductCredits(userId, 3, 'Video generation')

    // Create video record
    const script = await prisma.script.findFirst({
      where: { id: data.scriptId, userId },
    })

    if (!script) {
      throw createError('Script not found', 404)
    }

    const video = await prisma.video.create({
      data: {
        userId,
        scriptId: data.scriptId,
        title: script.title,
        status: 'PROCESSING',
      },
    })

    // Add jobs to queues
    const audioJob = await addJob(audioQueue, JobType.AUDIO_GENERATION, {
      scriptId: data.scriptId,
      userId,
    })

    const thumbnailJob = await addJob(thumbnailQueue, JobType.THUMBNAIL_GENERATION, {
      scriptId: data.scriptId,
      userId,
      title: script.title,
      style: data.thumbnailStyle,
    })

    res.json({
      videoId: video.id,
      audioJobId: audioJob.id,
      thumbnailJobId: thumbnailJob.id,
      message: 'Video generation started',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Get user videos
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { limit = 20, offset = 0 } = req.query

    const videos = await prisma.video.findMany({
      where: { userId },
      include: {
        script: {
          select: {
            id: true,
            title: true,
            content: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    res.json({ videos })
  } catch (error) {
    throw error
  }
})

// Get video by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params

    const video = await prisma.video.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        script: {
          select: {
            id: true,
            title: true,
            content: true,
          }
        }
      },
    })

    if (!video) {
      throw createError('Video not found', 404)
    }

    res.json({ video })
  } catch (error) {
    throw error
  }
})

// Delete video
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { id } = req.params

    await prisma.video.deleteMany({
      where: {
        id,
        userId,
      },
    })

    res.json({ message: 'Video deleted successfully' })
  } catch (error) {
    throw error
  }
})

export { router as videoRouter } 
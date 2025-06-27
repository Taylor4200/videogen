import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { getYouTubeAuthUrl, connectYouTubeAccount, getUserYouTubeAccounts } from '../services/youtubeService'
import { addJob, youtubeQueue } from '../lib/queue'
import { JobType } from '@prisma/client'
import { createError } from '../middleware/errorHandler'
import { z } from 'zod'

const router = Router()

const uploadToYouTubeSchema = z.object({
  videoId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
})

// Get YouTube auth URL
router.get('/auth-url', async (req: Request, res: Response) => {
  try {
    const authUrl = await getYouTubeAuthUrl()
    res.json({ authUrl })
  } catch (error) {
    throw error
  }
})

// Connect YouTube account
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { code } = req.body

    if (!code) {
      throw createError('Authorization code required', 400)
    }

    await connectYouTubeAccount(userId, code)
    res.json({ message: 'YouTube account connected successfully' })
  } catch (error) {
    throw error
  }
})

// Get connected YouTube accounts
router.get('/accounts', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const accounts = await getUserYouTubeAccounts(userId)
    res.json({ accounts })
  } catch (error) {
    throw error
  }
})

// Upload video to YouTube
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const data = uploadToYouTubeSchema.parse(req.body)

    // Verify video exists and belongs to user
    const video = await prisma.video.findFirst({
      where: {
        id: data.videoId,
        userId,
        status: 'COMPLETED',
      },
    })

    if (!video) {
      throw createError('Video not found or not ready', 404)
    }

    // Check if user has connected YouTube account
    const youtubeAccount = await prisma.youTubeAccount.findFirst({
      where: { userId },
    })

    if (!youtubeAccount) {
      throw createError('No YouTube account connected', 400)
    }

    // Add to upload queue
    const job = await addJob(youtubeQueue, JobType.YOUTUBE_UPLOAD, {
      videoId: data.videoId,
      userId,
      title: data.title,
      description: data.description || '',
      tags: data.tags || [],
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    })

    res.json({
      jobId: job.id,
      message: 'YouTube upload started',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

export { router as youtubeRouter } 
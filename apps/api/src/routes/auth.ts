import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateToken } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError('User already exists', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        creditBalance: true,
      }
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      user,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        creditBalance: true,
      }
    })

    if (!user) {
      throw createError('Invalid credentials', 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401)
    }

    // Generate token
    const token = generateToken(user.id)

    const { password: _, ...userWithoutPassword } = user

    res.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data' })
    }
    throw error
  }
})

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    if (!userId) {
      throw createError('Not authenticated', 401)
    }

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
      }
    })

    if (!user) {
      throw createError('User not found', 404)
    }

    res.json({ user })
  } catch (error) {
    throw error
  }
})

export { router as authRouter } 
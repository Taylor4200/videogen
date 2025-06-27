import { prisma } from '../lib/prisma'
import { CreditType } from '@prisma/client'

export interface CreditTransaction {
  userId: string
  amount: number
  type: CreditType
  description?: string
  stripePaymentIntentId?: string
}

export class CreditService {
  static async getBalance(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditBalance: true }
    })
    return user?.creditBalance || 0
  }

  static async addCredits(transaction: CreditTransaction): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Create credit record
      await tx.credit.create({
        data: {
          userId: transaction.userId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          stripePaymentIntentId: transaction.stripePaymentIntentId,
        }
      })

      // Update user balance
      await tx.user.update({
        where: { id: transaction.userId },
        data: {
          creditBalance: {
            increment: transaction.amount
          }
        }
      })
    })
  }

  static async deductCredits(userId: string, amount: number, description?: string): Promise<boolean> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { creditBalance: true }
      })

      if (!user || user.creditBalance < amount) {
        return false
      }

      // Create usage record
      await tx.credit.create({
        data: {
          userId,
          amount: -amount,
          type: CreditType.USAGE,
          description: description || 'Video generation',
        }
      })

      // Update user balance
      await tx.user.update({
        where: { id: userId },
        data: {
          creditBalance: {
            decrement: amount
          }
        }
      })

      return true
    })

    return result
  }

  static async getTransactionHistory(userId: string, limit = 50, offset = 0) {
    return await prisma.credit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
  }

  static async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const balance = await this.getBalance(userId)
    return balance >= required
  }
} 
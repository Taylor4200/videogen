import { google } from 'googleapis'
import { prisma } from '../lib/prisma'
import { VideoStatus } from '@prisma/client'

const youtube = google.youtube('v3')

export interface YouTubeUploadRequest {
  videoId: string
  userId: string
  title: string
  description: string
  tags: string[]
  thumbnailUrl?: string
  scheduledAt?: Date
}

export interface YouTubeUploadResult {
  youtubeVideoId: string
  status: VideoStatus
  publishedAt?: Date
}

export async function processYouTubeUpload(data: YouTubeUploadRequest): Promise<YouTubeUploadResult> {
  try {
    const { videoId, userId, title, description, tags, thumbnailUrl, scheduledAt } = data

    // Get video and user's YouTube account
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { s3Url: true }
    })

    const youtubeAccount = await prisma.youTubeAccount.findFirst({
      where: { userId }
    })

    if (!video || !youtubeAccount) {
      throw new Error('Video or YouTube account not found')
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    oauth2Client.setCredentials({
      access_token: youtubeAccount.accessToken,
      refresh_token: youtubeAccount.refreshToken,
    })

    // Download video from S3
    const videoBuffer = await downloadVideoFromS3(video.s3Url!)

    // Upload to YouTube
    const uploadResult = await uploadToYouTube(
      oauth2Client,
      videoBuffer,
      title,
      description,
      tags,
      scheduledAt
    )

    // Update video record
    await prisma.video.update({
      where: { id: videoId },
      data: {
        youtubeVideoId: uploadResult.youtubeVideoId,
        status: uploadResult.status,
        publishedAt: uploadResult.publishedAt,
      }
    })

    return uploadResult
  } catch (error) {
    console.error('YouTube upload error:', error)
    throw new Error('Failed to upload to YouTube')
  }
}

async function uploadToYouTube(
  oauth2Client: any,
  videoBuffer: Buffer,
  title: string,
  description: string,
  tags: string[],
  scheduledAt?: Date
): Promise<YouTubeUploadResult> {
  const requestBody = {
    snippet: {
      title,
      description,
      tags,
      categoryId: '22', // People & Blogs
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en',
    },
    status: {
      privacyStatus: scheduledAt ? 'private' : 'public',
      publishAt: scheduledAt?.toISOString(),
      selfDeclaredMadeForKids: false,
    },
  }

  const media = {
    body: videoBuffer,
  }

  const response = await youtube.videos.insert({
    auth: oauth2Client,
    part: ['snippet', 'status'],
    requestBody,
    media,
  })

  const youtubeVideoId = response.data.id!
  const status = scheduledAt ? VideoStatus.UPLOADED : VideoStatus.PUBLISHED
  const publishedAt = scheduledAt ? undefined : new Date()

  return {
    youtubeVideoId,
    status,
    publishedAt,
  }
}

async function downloadVideoFromS3(s3Url: string): Promise<Buffer> {
  const response = await fetch(s3Url)
  if (!response.ok) {
    throw new Error(`Failed to download video from S3: ${response.statusText}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

export async function connectYouTubeAccount(userId: string, authCode: string): Promise<void> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  const { tokens } = await oauth2Client.getToken(authCode)
  
  // Get channel info
  oauth2Client.setCredentials(tokens)
  const channelsResponse = await youtube.channels.list({
    auth: oauth2Client,
    part: ['snippet'],
    mine: true,
  })

  const channel = channelsResponse.data.items?.[0]
  if (!channel) {
    throw new Error('No YouTube channel found')
  }

  // Save to database
  await prisma.youTubeAccount.upsert({
    where: {
      userId_channelId: {
        userId,
        channelId: channel.id!,
      }
    },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiresAt: new Date(tokens.expiry_date!),
    },
    create: {
      userId,
      channelId: channel.id!,
      channelTitle: channel.snippet!.title!,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiresAt: new Date(tokens.expiry_date!),
    }
  })
}

export async function getYouTubeAuthUrl(): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
    ],
  })
}

export async function getUserYouTubeAccounts(userId: string) {
  return await prisma.youTubeAccount.findMany({
    where: { userId },
    select: {
      id: true,
      channelId: true,
      channelTitle: true,
      createdAt: true,
    }
  })
} 
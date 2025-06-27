import OpenAI from 'openai'
import { prisma } from '../lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface ThumbnailGenerationRequest {
  scriptId: string
  userId: string
  title: string
  style?: 'clickbait' | 'professional' | 'minimal'
}

export interface ThumbnailGenerationResult {
  thumbnailUrl: string
  s3Key: string
}

export async function processThumbnailGeneration(data: ThumbnailGenerationRequest): Promise<ThumbnailGenerationResult> {
  try {
    const { scriptId, userId, title, style = 'clickbait' } = data

    // Generate thumbnail using DALL-E
    const imageBuffer = await generateThumbnailWithDalle(title, style)
    
    // Upload to S3
    const s3Key = `thumbnails/${userId}/${scriptId}-${Date.now()}.png`
    const thumbnailUrl = await uploadThumbnailToS3(imageBuffer, s3Key)

    return {
      thumbnailUrl,
      s3Key,
    }
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    throw new Error('Failed to generate thumbnail')
  }
}

async function generateThumbnailWithDalle(title: string, style: string): Promise<Buffer> {
  const prompt = generateThumbnailPrompt(title, style)

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1280x720",
    quality: "standard",
    response_format: "b64_json",
  })

  const imageData = response.data[0]?.b64_json
  if (!imageData) {
    throw new Error('Failed to generate image')
  }

  return Buffer.from(imageData, 'base64')
}

function generateThumbnailPrompt(title: string, style: string): string {
  const basePrompt = `Create a compelling YouTube thumbnail for the title: "${title}". 
  
  Style requirements:
  - ${style === 'clickbait' ? 'Eye-catching, bold colors, dramatic elements, arrows, circles, shocked expressions' : ''}
  - ${style === 'professional' ? 'Clean, modern design, professional typography, subtle branding elements' : ''}
  - ${style === 'minimal' ? 'Simple, clean design, minimal text, focus on visual impact' : ''}
  
  Technical requirements:
  - 1280x720 resolution
  - High contrast for visibility
  - Readable text overlay
  - No copyrighted characters or logos
  - Suitable for all audiences
  
  Make it visually striking and optimized for YouTube's thumbnail format.`

  return basePrompt
}

async function uploadThumbnailToS3(imageBuffer: Buffer, s3Key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    Body: imageBuffer,
    ContentType: 'image/png',
    ACL: 'public-read',
  })

  await s3Client.send(command)
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
}

export async function updateVideoThumbnail(videoId: string, thumbnailUrl: string, s3Key: string): Promise<void> {
  await prisma.video.update({
    where: { id: videoId },
    data: {
      thumbnailS3Url: thumbnailUrl,
      thumbnailS3Key: s3Key,
    }
  })
} 
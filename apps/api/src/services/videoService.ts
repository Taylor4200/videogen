import { prisma } from '../lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import ffmpeg from 'fluent-ffmpeg'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface VideoGenerationRequest {
  scriptId: string
  userId: string
  audioUrl: string
  style?: 'modern' | 'minimal' | 'dynamic'
}

export interface VideoGenerationResult {
  videoUrl: string
  s3Key: string
  duration: number
  thumbnailUrl?: string
}

export async function processVideoRendering(data: VideoGenerationRequest): Promise<VideoGenerationResult> {
  try {
    const { scriptId, userId, audioUrl, style = 'modern' } = data

    // Get script for content
    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      select: { content: true, title: true }
    })

    if (!script) {
      throw new Error('Script not found')
    }

    // Generate background images
    const backgroundImages = await generateBackgroundImages(script.content, style)
    
    // Create video with FFmpeg
    const videoPath = await createVideoWithFFmpeg(audioUrl, backgroundImages, script.content)
    
    // Upload to S3
    const s3Key = `videos/${userId}/${scriptId}-${Date.now()}.mp4`
    const videoUrl = await uploadVideoToS3(videoPath, s3Key)

    // Generate thumbnail
    const thumbnailUrl = await generateThumbnail(videoPath, userId, scriptId)

    // Clean up temporary files
    await cleanupTempFiles([videoPath, ...backgroundImages])

    return {
      videoUrl,
      s3Key,
      duration: await getVideoDuration(videoPath),
      thumbnailUrl,
    }
  } catch (error) {
    console.error('Video rendering error:', error)
    throw new Error('Failed to render video')
  }
}

async function generateBackgroundImages(content: string, style: string): Promise<string[]> {
  // This would integrate with DALL-E or Stable Diffusion
  // For now, return placeholder image paths
  const imagePromises = []
  const segments = content.split('\n\n').slice(0, 5) // Max 5 images
  
  for (let i = 0; i < segments.length; i++) {
    const imagePath = join(tmpdir(), `bg-${i}-${Date.now()}.jpg`)
    // In production, this would call DALL-E API
    await writeFile(imagePath, 'placeholder-image-data')
    imagePromises.push(imagePath)
  }
  
  return imagePromises
}

async function createVideoWithFFmpeg(audioUrl: string, images: string[], content: string): Promise<string> {
  const outputPath = join(tmpdir(), `video-${Date.now()}.mp4`)
  
  return new Promise((resolve, reject) => {
    let command = ffmpeg()
      .input(audioUrl)
      .inputOptions(['-stream_loop -1'])
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-pix_fmt yuv420p',
        '-movflags +faststart',
        '-vf scale=1920:1080',
        '-r 30'
      ])

    // Add images as video input
    images.forEach((image, index) => {
      command = command.input(image)
        .inputOptions([`-loop 1`, `-t ${Math.max(3, content.length / 100)}`])
    })

    command
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run()
  })
}

async function uploadVideoToS3(videoPath: string, s3Key: string): Promise<string> {
  const videoBuffer = await readFile(videoPath)
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    Body: videoBuffer,
    ContentType: 'video/mp4',
    ACL: 'public-read',
  })

  await s3Client.send(command)
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
}

async function generateThumbnail(videoPath: string, userId: string, scriptId: string): Promise<string> {
  const thumbnailPath = join(tmpdir(), `thumbnail-${Date.now()}.jpg`)
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: thumbnailPath,
        size: '1280x720'
      })
      .on('end', async () => {
        try {
          const s3Key = `thumbnails/${userId}/${scriptId}-${Date.now()}.jpg`
          const thumbnailUrl = await uploadThumbnailToS3(thumbnailPath, s3Key)
          await unlink(thumbnailPath)
          resolve(thumbnailUrl)
        } catch (error) {
          reject(error)
        }
      })
      .on('error', reject)
  })
}

async function uploadThumbnailToS3(thumbnailPath: string, s3Key: string): Promise<string> {
  const thumbnailBuffer = await readFile(thumbnailPath)
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    Body: thumbnailBuffer,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  })

  await s3Client.send(command)
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
}

async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err)
      else resolve(Math.round(metadata.format.duration || 0))
    })
  })
}

async function cleanupTempFiles(files: string[]): Promise<void> {
  await Promise.all(files.map(file => unlink(file).catch(() => {})))
}

async function readFile(path: string): Promise<Buffer> {
  return await promisify(require('fs').readFile)(path)
} 
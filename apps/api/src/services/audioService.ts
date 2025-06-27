import { prisma } from '../lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface AudioGenerationRequest {
  scriptId: string
  userId: string
  voiceId?: string
}

export interface AudioGenerationResult {
  audioUrl: string
  s3Key: string
  duration: number
}

export async function processAudioGeneration(data: AudioGenerationRequest): Promise<AudioGenerationResult> {
  try {
    const { scriptId, userId, voiceId = 'en-US-Neural2-F' } = data

    // Get script content
    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      select: { content: true, title: true }
    })

    if (!script) {
      throw new Error('Script not found')
    }

    // Generate audio using ElevenLabs API
    const audioBuffer = await generateAudioWithElevenLabs(script.content, voiceId)
    
    // Upload to S3
    const s3Key = `audio/${userId}/${scriptId}-${Date.now()}.mp3`
    const audioUrl = await uploadAudioToS3(audioBuffer, s3Key)

    // Calculate duration (approximate)
    const duration = Math.round(script.content.split(' ').length * 0.4) // Rough estimate

    return {
      audioUrl,
      s3Key,
      duration,
    }
  } catch (error) {
    console.error('Audio generation error:', error)
    throw new Error('Failed to generate audio')
  }
}

async function generateAudioWithElevenLabs(text: string, voiceId: string): Promise<Buffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

async function uploadAudioToS3(audioBuffer: Buffer, s3Key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
    ACL: 'public-read',
  })

  await s3Client.send(command)
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`
}

export async function getAudioUrl(s3Key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
  })

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
} 
import OpenAI from 'openai'
import { prisma } from '../lib/prisma'
import { ScriptStatus } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ScriptGenerationRequest {
  userId: string
  niche: string
  keywords: string[]
  length: number // in seconds
  title?: string
}

export interface ScriptGenerationResult {
  scriptId: string
  title: string
  content: string
  status: ScriptStatus
}

export async function processScriptGeneration(data: ScriptGenerationRequest): Promise<ScriptGenerationResult> {
  try {
    const { userId, niche, keywords, length, title } = data

    // Generate script using OpenAI
    const prompt = `Create a compelling YouTube video script for a ${niche} channel. 
    
    Requirements:
    - Duration: ${length} seconds (approximately ${Math.round(length / 60)} minutes)
    - Keywords to include: ${keywords.join(', ')}
    - Engaging hook in the first 10 seconds
    - Clear structure with introduction, main points, and conclusion
    - Conversational tone that's easy to read aloud
    - Include natural pauses and emphasis markers
    
    Format the script with clear sections and timing cues.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert YouTube script writer who creates engaging, viral-worthy content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''
    const generatedTitle = title || `Amazing ${niche} Content - Must Watch!`

    // Save script to database
    const script = await prisma.script.create({
      data: {
        userId,
        title: generatedTitle,
        content: generatedContent,
        niche,
        keywords,
        length,
        status: ScriptStatus.GENERATED,
      }
    })

    return {
      scriptId: script.id,
      title: script.title,
      content: script.content,
      status: script.status,
    }
  } catch (error) {
    console.error('Script generation error:', error)
    throw new Error('Failed to generate script')
  }
}

export async function updateScript(scriptId: string, updates: Partial<{
  title: string
  content: string
  status: ScriptStatus
}>) {
  return await prisma.script.update({
    where: { id: scriptId },
    data: updates,
  })
}

export async function getUserScripts(userId: string, limit = 20, offset = 0) {
  return await prisma.script.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function getScriptById(scriptId: string) {
  return await prisma.script.findUnique({
    where: { id: scriptId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    }
  })
} 
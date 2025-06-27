import { Queue, Worker, Job } from 'bullmq'
import redis from './redis'
import { JobType } from '@prisma/client'
import { processScriptGeneration } from '../services/scriptService'
import { processAudioGeneration } from '../services/audioService'
import { processVideoRendering } from '../services/videoService'
import { processYouTubeUpload } from '../services/youtubeService'
import { processThumbnailGeneration } from '../services/thumbnailService'

// Create queues
export const scriptQueue = new Queue('script-generation', { connection: redis })
export const audioQueue = new Queue('audio-generation', { connection: redis })
export const videoQueue = new Queue('video-rendering', { connection: redis })
export const youtubeQueue = new Queue('youtube-upload', { connection: redis })
export const thumbnailQueue = new Queue('thumbnail-generation', { connection: redis })

// Create workers
const scriptWorker = new Worker('script-generation', async (job: Job) => {
  return await processScriptGeneration(job.data)
}, { connection: redis })

const audioWorker = new Worker('audio-generation', async (job: Job) => {
  return await processAudioGeneration(job.data)
}, { connection: redis })

const videoWorker = new Worker('video-rendering', async (job: Job) => {
  return await processVideoRendering(job.data)
}, { connection: redis })

const youtubeWorker = new Worker('youtube-upload', async (job: Job) => {
  return await processYouTubeUpload(job.data)
}, { connection: redis })

const thumbnailWorker = new Worker('thumbnail-generation', async (job: Job) => {
  return await processThumbnailGeneration(job.data)
}, { connection: redis })

// Error handling
scriptWorker.on('error', (err) => {
  console.error('Script worker error:', err)
})

audioWorker.on('error', (err) => {
  console.error('Audio worker error:', err)
})

videoWorker.on('error', (err) => {
  console.error('Video worker error:', err)
})

youtubeWorker.on('error', (err) => {
  console.error('YouTube worker error:', err)
})

thumbnailWorker.on('error', (err) => {
  console.error('Thumbnail worker error:', err)
})

export const addJob = async (queue: Queue, type: JobType, data: any) => {
  return await queue.add(type, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  })
} 
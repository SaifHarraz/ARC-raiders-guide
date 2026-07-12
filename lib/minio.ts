import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3-compatible client - initialized lazily
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000'

    console.log('🔧 Initializing S3 client with:', {
      endpoint,
      region: process.env.MINIO_REGION || 'auto',
      accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    })

    s3Client = new S3Client({
      region: process.env.MINIO_REGION || 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.MINIO_ROOT_USER || 'minioadmin',
        secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
      },
      forcePathStyle: true, // required for R2 and most S3-compatible services
    })
  }

  return s3Client
}

// Default bucket name
export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'arcraiders-uploads'

// Public endpoint for direct file URLs (e.g. R2 public bucket URL)
const PUBLIC_MINIO_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000'

/**
 * Initialize bucket if it doesn't exist.
 * NOTE: R2 public read access is configured via the Cloudflare dashboard
 * (bucket Settings -> Public Access toggle), not via a bucket policy API call.
 */
export async function initializeMinio() {
  try {
    const client = getS3Client()

    try {
      await client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }))
      console.log(`✅ Bucket '${BUCKET_NAME}' already exists`)
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        await client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }))
        console.log(`✅ Bucket '${BUCKET_NAME}' created successfully`)
      } else {
        throw err
      }
    }

    console.log(
      `ℹ️  Remember to enable "Public Access" for this bucket in your storage provider's dashboard if you haven't already.`
    )
  } catch (error) {
    console.error('❌ Error initializing storage bucket:', error)
    throw error
  }
}

/**
 * Upload a file
 */
export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  metadata?: Record<string, string>
) {
  try {
    const client = getS3Client()

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        Metadata: metadata,
      })
    )

    const url = `${PUBLIC_MINIO_URL}/${BUCKET_NAME}/${fileName}`

    return { success: true, url, fileName }
  } catch (error: any) {
    console.error('❌ Error uploading file:', error)
    console.error('Storage Error Details:', {
      name: error.name,
      message: error.message,
      statusCode: error.$metadata?.httpStatusCode,
    })
    throw error
  }
}

/**
 * Get a public URL for a file
 */
export async function getFileUrl(fileName: string, _expirySeconds?: number) {
  return `${PUBLIC_MINIO_URL}/${BUCKET_NAME}/${fileName}`
}

/**
 * Get a presigned URL for a file
 */
export async function getPresignedUrl(fileName: string, expirySeconds: number = 24 * 60 * 60 * 7) {
  try {
    const client = getS3Client()
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName })
    const url = await getSignedUrl(client, command, { expiresIn: expirySeconds })
    return url
  } catch (error) {
    console.error('❌ Error getting presigned URL:', error)
    throw error
  }
}

/**
 * Delete a file
 */
export async function deleteFile(fileName: string) {
  try {
    const client = getS3Client()
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: fileName }))
    return { success: true, fileName }
  } catch (error) {
    console.error('❌ Error deleting file:', error)
    throw error
  }
}

/**
 * List all files in the bucket
 */
export async function listFiles(prefix?: string) {
  try {
    const client = getS3Client()
    const result = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix })
    )

    return (result.Contents || []).map((obj) => ({
      name: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    }))
  } catch (error) {
    console.error('❌ Error listing files:', error)
    throw error
  }
}

/**
 * Extract filename from a presigned URL
 */
export function extractFilenameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length >= 2) {
      return parts.slice(1).join('/')
    }
    return null
  } catch {
    return null
  }
}

export default getS3Client
import { Client } from 'minio'
// Parse MinIO/S3 endpoint 
function parseMinioEndpoint(endpoint: string | undefined) {
  if (!endpoint) {
    return { endPoint: 'localhost', port: 9000, useSSL: false };
  }

  const useSSL = endpoint.startsWith('https');
  const cleanEndpoint = endpoint.replace('http://', '').replace('https://', '');

  // Split host and port
  const [endPoint, portStr] = cleanEndpoint.split(':');
  const port = portStr ? parseInt(portStr, 10) : (useSSL ? 443 : 9000);

  return { endPoint, port, useSSL };
}

// MinIO/S3 client - initialized lazily
let minioClient: Client | null = null;

function getMinioClient(): Client {
  if (!minioClient) {
    const { endPoint, port, useSSL } = parseMinioEndpoint(process.env.MINIO_ENDPOINT);

    console.log('🔧 Initializing storage client with:', {
      endPoint,
      port,
      useSSL,
      accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
      region: process.env.MINIO_REGION || 'us-east-1',
    });

    minioClient = new Client({
      endPoint,
      port,
      useSSL,
      accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
      secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
      region: process.env.MINIO_REGION || 'us-east-1',
    });
  }

  return minioClient;
}

// Default bucket name
export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'arcraiders-uploads'

// Public endpoint for direct file URLs (e.g. R2 public bucket URL, or your CDN domain)
const PUBLIC_MINIO_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000'

/**
 * Rewrite internal storage URL to public URL
 */
function rewriteToPublicUrl(internalUrl: string): string {
  try {
    const url = new URL(internalUrl)
    const publicUrl = new URL(PUBLIC_MINIO_URL)

    url.protocol = publicUrl.protocol
    url.host = publicUrl.host
    url.port = publicUrl.port

    if (publicUrl.pathname && publicUrl.pathname !== '/') {
      url.pathname = publicUrl.pathname + url.pathname
    }

    return url.toString()
  } catch {
    return internalUrl
  }
}

/**
 * Initialize bucket if it doesn't exist.
 * NOTE: setBucketPolicy is skipped for R2 — R2 doesn't support S3 bucket policy API.
 * Public read access on R2 is instead configured via the Cloudflare dashboard
 * (bucket Settings -> Public Access toggle). This function tries the policy call
 * for real MinIO servers, but safely no-ops if it's not supported (like on R2).
 */
export async function initializeMinio() {
  try {
    const client = getMinioClient();
    const bucketExists = await client.bucketExists(BUCKET_NAME)

    if (!bucketExists) {
      await client.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'us-east-1')
      console.log(`✅ Bucket '${BUCKET_NAME}' created successfully`)
    } else {
      console.log(`✅ Bucket '${BUCKET_NAME}' already exists`)
    }

    // Try to set public read policy — only works on real MinIO, not R2.
    // R2 users: enable Public Access manually in the Cloudflare dashboard instead.
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      }
      await client.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
      console.log(`✅ Bucket '${BUCKET_NAME}' public read policy set`)
    } catch (policyError) {
      console.warn(
        `⚠️  Could not set bucket policy via API (expected on R2/Backblaze — set Public Access in your provider's dashboard instead). Continuing.`
      )
    }
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
    const client = getMinioClient();

    const bucketExists = await client.bucketExists(BUCKET_NAME)
    if (!bucketExists) {
      console.log(`Creating bucket '${BUCKET_NAME}'...`)
      await client.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'us-east-1')
      console.log(`✅ Bucket '${BUCKET_NAME}' created successfully`)
    }

    await client.putObject(
      BUCKET_NAME,
      fileName,
      fileBuffer,
      fileBuffer.length,
      metadata
    )

    const url = `${PUBLIC_MINIO_URL}/${BUCKET_NAME}/${fileName}`

    return { success: true, url, fileName }
  } catch (error: any) {
    console.error('❌ Error uploading file:', error)
    console.error('Storage Error Details:', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
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
    const client = getMinioClient();
    const internalUrl = await client.presignedGetObject(BUCKET_NAME, fileName, expirySeconds)
    return rewriteToPublicUrl(internalUrl)
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
    const client = getMinioClient();
    await client.removeObject(BUCKET_NAME, fileName)
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
    const client = getMinioClient();
    const objectsStream = client.listObjects(BUCKET_NAME, prefix, true)
    const files: Array<{ name: string; size: number; lastModified: Date }> = []

    return new Promise((resolve, reject) => {
      objectsStream.on('data', (obj) => {
        if (obj.name && obj.size !== undefined && obj.lastModified) {
          files.push({
            name: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
          })
        }
      })
      objectsStream.on('end', () => resolve(files))
      objectsStream.on('error', (err) => reject(err))
    })
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
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(1).join('/');
    }
    return null;
  } catch {
    return null;
  }
}

export default getMinioClient
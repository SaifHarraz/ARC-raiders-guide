import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
      accessKeyId: process.env.MINIO_ROOT_USER!,
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
    },
    forcePathStyle: true,
  })

  const result = await client.send(new ListBucketsCommand({}))
  console.log('Buckets this token can see:')
  result.Buckets?.forEach((b) => console.log(' - Name:', JSON.stringify(b.Name)))
}

main().catch((err) => console.error('Failed:', err))
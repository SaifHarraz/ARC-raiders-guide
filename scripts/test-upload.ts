import * as dotenv from 'dotenv'
dotenv.config()

import { uploadFile } from '../lib/minio'

async function test() {
  console.log('📤 Testing upload to R2...')
  const buffer = Buffer.from('Hello from ARC Raiders Guide test upload!')
  const result = await uploadFile('test/hello.txt', buffer, { 'Content-Type': 'text/plain' })
  console.log('✅ Upload successful!')
  console.log('URL:', result.url)
}

test().catch((err) => {
  console.error('❌ Upload failed:', err)
})
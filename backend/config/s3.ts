import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  followRegionRedirects: true,
});

s3.send(new HeadBucketCommand({ Bucket: process.env.AWS_BUCKET! }))
  .then(() => console.log('✅ S3 connected'))
  .catch((err) => {
    console.error('❌ S3 connection failed:');
  });

import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3';
import Uploads from '../modelsDB/upload';
import Conversation from '../modelsDB/conversation';
import type { UploadFile } from '../modelsDB/upload';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// presigned URL for frontend to upload directly to S3
export const getPresignedUploadUrl = async (
  filename: string,
  mimetype: string,
): Promise<{ key: string; uploadUrl: string }> => {
  const ext = path.extname(filename);
  const key = `uploads/${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
    ContentType: mimetype,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return { key, uploadUrl };
};

// presigned URL for frontend to download directly from S3
export const getPresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key, 
  });

  return await getSignedUrl(s3, command, { expiresIn: 60 });
};

export const addUploadFile = async (file: UploadFile) => {
  const conversation = await Conversation.findById(file.conversationId);

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const savedFile = new Uploads(file);
  await savedFile.save();

  return savedFile;
};

export const deleteFile = async (id: string) => {
  return await Uploads.deleteOne({ _id: id });
};

export const getfile = async (id: string) => {
  return Uploads.findOne({ _id: id });
};

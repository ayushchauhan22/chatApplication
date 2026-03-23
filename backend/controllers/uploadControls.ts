import { Request, Response } from 'express';
import {
  getPresignedUploadUrl,
  getPresignedUrl,
  addUploadFile,
  deleteFile,
  getfile,
} from '../services/uploadService';

export const getUploadUrl = async (req: Request, res: Response) => {
  const { filename, mimetype } = req.query as {
    filename: string;
    mimetype: string;
  };

  if (!filename || !mimetype) {
    return res
      .status(400)
      .json({ message: 'filename and mimetype are required' });
  }

  const { key, uploadUrl } = await getPresignedUploadUrl(filename, mimetype);
  res.json({ key, uploadUrl });
};

export const saveFileMetadata = async (req: Request, res: Response) => {
  const { filename, key, mimetype, size, conversationId, senderId } = req.body;
  
  if (!key || !conversationId || !senderId) {
    return res
      .status(400)
      .json({ message: 'key, conversationId and senderId are required' });
  }

  const saved = await addUploadFile({
    filename,
    fileUrl: key, 
    fileType: mimetype,
    size,
    senderId,
    conversationId,
  });

  res.status(201).json(saved);
};

export const getDownloadUrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await getfile(String(id));
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  const presignedUrl = await getPresignedUrl(file.fileUrl); 
  res.json({ url: presignedUrl });
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await getfile(String(id));
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.json(file);
};

export const removeFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await getfile(String(id));
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  await deleteFile(String(id));
  res.json({ message: 'File deleted successfully' });
};

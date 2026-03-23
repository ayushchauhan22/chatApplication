import express from 'express';
import { Wrapper } from '../wrappers/wrapper';
import { isAuthorizedUser } from '../middleware/authMiddleware';
import {
  getUploadUrl,
  saveFileMetadata,
  getFile,
  removeFile,
  getDownloadUrl,
} from '../controllers/uploadControls';

const route = express.Router();

route.get('/upload-url', isAuthorizedUser, Wrapper(getUploadUrl)); 
route.post('/save', isAuthorizedUser, Wrapper(saveFileMetadata));
route.get('/download/:id', isAuthorizedUser, Wrapper(getDownloadUrl));
route.get('/:id', isAuthorizedUser, Wrapper(getFile)); 
route.delete('/:id', isAuthorizedUser, Wrapper(removeFile)); 

export default route;

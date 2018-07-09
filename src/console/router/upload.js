/** @flow */

import multer from 'multer';
import { MAX_UPLOAD_SIZE, MAX_UPLOAD_COUNT } from '../config';

export type UploadedFile = {
  fieldname: string,
  mimetype: string,
  size: number,
  buffer: Buffer
};

const storage = multer.memoryStorage();
export default multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE, files: MAX_UPLOAD_COUNT }
}).any();

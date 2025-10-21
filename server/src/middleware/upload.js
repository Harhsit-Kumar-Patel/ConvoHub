import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Allowed file types
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    // Generate random filename to prevent path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = ALLOWED_FILE_TYPES[file.mimetype];
    cb(null, `${randomName}.${ext}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files per request
  },
  fileFilter: fileFilter,
}).single('file');

export default upload;
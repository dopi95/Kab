import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'depzhcwaf',
  api_key: process.env.CLOUDINARY_API_KEY || '668394851431889',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'uK5spMIxy-m-zbO3X_mGVzhBCRw',
  secure: true,
});

export default cloudinary;

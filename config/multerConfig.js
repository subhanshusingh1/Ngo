import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js'; 

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'events_gallery', // Cloudinary folder to store images
        allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
    }
});

const upload = multer({ 
    storage: storage,
    // limits: { fileSize: 5 * 1024 * 1024 } // 5MB size limit per file
});


export default upload;

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping((err, res) => {
  if (err) {
    console.error('❌ Error de conexión con Cloudinary:', err);
  } else {
    console.log('✅ Conexión exitosa con Cloudinary:', res);
  }
});

export const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      return data.secure_url as string;
    } else {
      console.error('❌ Error Cloudinary:', data);
      return null;
    }
  } catch (err) {
    console.error('⚠️ Falló subida a Cloudinary:', err);
    return null;
  }
};

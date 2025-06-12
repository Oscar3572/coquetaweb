import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Convertir a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mime = file.type;
    const dataURI = `data:${mime};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'productos_coqueta',
    });

    return NextResponse.json(result);
  } catch (error) {
  const err = error as Error;
  console.error('Cloudinary Error:', err);
  return NextResponse.json({ error: err.message || 'Cloudinary upload failed' }, { status: 500 });
}
}

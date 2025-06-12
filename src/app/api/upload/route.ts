import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
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
  } catch (error: any) {
    console.error('Cloudinary Error:', error);
    return NextResponse.json({ error: error.message || 'Cloudinary upload failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const archivos = Array.from(formData.entries()).filter(([_, value]) => value instanceof File);

    if (archivos.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos válidos' }, { status: 400 });
    }

    const uploads = await Promise.all(
      archivos.map(async ([key, archivo]) => {
        const file = archivo as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

        const resultado = await cloudinary.uploader.upload(dataURI, {
          folder: 'productos_coqueta',
          resource_type: resourceType,
          upload_preset: 'ml_default', // opcional, según tu configuración en Cloudinary
        });

        return resultado.secure_url;
      })
    );

    return NextResponse.json({ urls: uploads }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error('Cloudinary Error:', err);
    return NextResponse.json(
      { error: err.message || 'Error al subir archivos a Cloudinary' },
      { status: 500 }
    );
  }
}

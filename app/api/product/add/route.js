import authSeller from '@/lib/authSeller';
import { getAuth } from '@clerk/nextjs/dist/types/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'not authorized' });
    }

    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const vategory = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');

    const files = formData.getAll('images');

    if (!files || files.lenngth === 0) {
      return NextResponse.json({
        success: false,
        message: 'not files uploaded',
      });
    }

    const result = await Promise.all(
      files.map(async file => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promisse((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );

    const image = result.map(result => result.secure_url);
  } catch (error) {}
}

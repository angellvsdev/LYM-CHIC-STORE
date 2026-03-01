import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';

// Configure Cloudinary with SSL options for development
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // Add SSL configuration for development
  secure: true,
});

// Configure HTTPS agent to handle SSL certificate issues
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only for development - remove in production
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with error handling
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'lym-chicstore',
          secure: true,
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { crop: 'limit', width: 1200, height: 1200 }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`));
          } else {
            resolve(result);
          }
        }
      );

      // Handle upload with error catching
      try {
        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        uploadStream.end(buffer);
      } catch (error) {
        console.error('Upload error:', error);
        reject(error);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format,
        size: (result as any).bytes,
      }
    });

  } catch (error) {
    const err = error as Error & { cause?: { code?: string } };
    
    console.error('Upload error details:', {
      message: err.message,
      cause: err.cause,
      stack: err.stack,
      name: err.name
    });

    // Handle specific SSL certificate errors
    if (err.cause?.code === 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SSL Certificate Error: Unable to verify Cloudinary connection. This might be a network issue in development.' 
        },
        { status: 500 }
      );
    }

    // Handle network errors
    if (err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Network Error: Unable to connect to Cloudinary. Please check your internet connection.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: `Upload failed: ${err.message || 'Unknown error occurred'}` 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Delete failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public/uploads');
  
  // Ensure the upload directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    return NextResponse.json({ success: false, error: 'Failed to create upload directory' }, { status: 500 });
  }
  
  // Use a timestamp for unique filenames
  const filename = `${Date.now()}-${file.name}`;
  const path = join(uploadDir, filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    // Return the public URL of the file
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}

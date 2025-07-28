
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';

export async function POST(request: Request) {
  const session: Session | null = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Not logged in' }, { status: 401 });
  }

  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public/uploads');
  
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    return NextResponse.json({ success: false, error: 'Failed to create upload directory' }, { status: 500 });
  }
  
  const fileExtension = file.name.split('.').pop();
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `${uniqueSuffix}.${fileExtension}`;
  const path = join(uploadDir, filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from your self-hosted API!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
} 
import { NextResponse } from 'next/server';
import register from '../../../lib/metrics';

export async function GET() {
    try {
        const body = await register.metrics();
        const contentType = register.contentType || 'text/plain; version=0.0.4';
        return new NextResponse(body, { status: 200, headers: { 'Content-Type': contentType } });
    } catch (err) {
        return NextResponse.json({ message: 'Failed to render metrics' }, { status: 500 });
    }
}

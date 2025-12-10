import { NextResponse } from 'next/server';

export function jsonResponse<T>(data: T, init?: ResponseInit) {
    try {
        console.log('Response JSON:', JSON.stringify(data));
    } catch (err) {
        // Fallback if data isn't serializable
        console.log('Response JSON (unserializable):', data);
    }
    return NextResponse.json(data, init);
}

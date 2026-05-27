import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    stripe_key_prefix: (process.env.STRIPE_SECRET_KEY || 'MISSING').slice(0, 25),
    base_url: process.env.NEXT_PUBLIC_BASE_URL || 'MISSING'
  })
}

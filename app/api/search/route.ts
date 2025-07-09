import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/typesense'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  if (!q) return NextResponse.json([])

  // Buscar hasta 5 productos
  const products = await searchProducts(q, '')
  return NextResponse.json(products.slice(0, 5))
} 
import { NextRequest, NextResponse } from 'next/server'
import Typesense from 'typesense'

const client = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'localhost',
    port: parseInt(process.env.TYPESENSE_PORT || '8108'),
    protocol: process.env.TYPESENSE_PROTOCOL || 'http'
  }],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2
})

export async function GET(req: NextRequest) {
  try {
    const categoryStats = await client.collections('products').documents().search({
      q: '*',
      facet_by: 'category',
      per_page: 0
    })

    const totalStats = await client.collections('products').documents().search({
      q: '*',
      per_page: 0
    })

    const categories = [
      { id: "all", name: "Todos", count: totalStats.found || 0 }
    ]

    if (categoryStats.facet_counts && categoryStats.facet_counts[0]) {
      categoryStats.facet_counts[0].counts.forEach(count => {
        categories.push({
          id: count.value,
          name: getCategoryName(count.value),
          count: count.count
        })
      })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return NextResponse.json([
      { id: "all", name: "Todos", count: 0 },
      { id: "electronics", name: "Electrónicos", count: 0 },
      { id: "clothing", name: "Ropa", count: 0 },
      { id: "books", name: "Libros", count: 0 },
      { id: "home", name: "Hogar", count: 0 },
      { id: "sports", name: "Deportes", count: 0 },
      { id: "beauty", name: "Belleza", count: 0 },
      { id: "toys", name: "Juguetes", count: 0 },
      { id: "automotive", name: "Automotriz", count: 0 }
    ])
  }
}

function getCategoryName(categoryId: string): string {
  const categoryNames: { [key: string]: string } = {
    'electronics': 'Electrónicos',
    'clothing': 'Ropa',
    'books': 'Libros',
    'home': 'Hogar',
    'sports': 'Deportes',
    'beauty': 'Belleza',
    'toys': 'Juguetes',
    'automotive': 'Automotriz'
  }
  return categoryNames[categoryId] || categoryId
} 
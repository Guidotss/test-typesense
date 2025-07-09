import type { Product } from "./types"
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

export async function searchProducts(query: string = '', category: string = '', page: number = 1, perPage: number = 20): Promise<{ products: Product[], total: number }> {
  try {
    const searchParameters: any = {
      q: query || '*',
      query_by: 'name,description,tags',
      sort_by: '_text_match:desc,rating:desc',
      per_page: perPage,
      page: page
    }

    if (category && category !== 'all') {
      searchParameters.filter_by = `category:=${category}`
      console.log(`🔍 Buscando productos de categoría: ${category}`)
    } else {
      console.log('🔍 Buscando todos los productos')
    }

    const searchResults = await client
      .collections('products')
      .documents()
      .search(searchParameters)

    const products = searchResults.hits?.map(hit => hit.document as Product) || []
    const total = searchResults.found || 0
    console.log(`✅ Encontrados ${products.length} productos (total: ${total})`)
    
    // Mostrar algunos ejemplos para debug
    if (products.length > 0) {
      console.log('📄 Ejemplos de productos:')
      products.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category})`)
      })
    }

    return { products, total }
  } catch (error) {
    console.error('Error searching products:', error)
    const mock = getMockProducts(query, category)
    return { products: mock, total: mock.length }
  }
}

function getMockProducts(query = "", category = ""): Product[] {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      description: "El último iPhone con chip A17 Pro y cámara de 48MP",
      price: 999.99,
      originalPrice: 1099.99,
      discount: 9,
      category: "electronics",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 1250,
      stock: 15,
      tags: ["smartphone", "apple", "premium"],
    },
    {
      id: "2",
      name: "MacBook Air M2",
      description: "Laptop ultradelgada con chip M2 y pantalla Liquid Retina",
      price: 1199.99,
      originalPrice: 1199.99,
      discount: 0,
      category: "electronics",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 890,
      stock: 8,
      tags: ["laptop", "apple", "productivity"],
    },
    {
      id: "3",
      name: "Camiseta Premium Cotton",
      description: "Camiseta 100% algodón orgánico, suave y cómoda",
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
      category: "clothing",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviews: 324,
      stock: 50,
      tags: ["shirt", "cotton", "casual"],
    },
    {
      id: "4",
      name: "El Arte de la Guerra",
      description: "Clásico libro de estrategia militar y empresarial",
      price: 15.99,
      originalPrice: 15.99,
      discount: 0,
      category: "books",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 2100,
      stock: 25,
      tags: ["strategy", "classic", "business"],
    },
    {
      id: "5",
      name: "Lámpara LED Inteligente",
      description: "Lámpara con control por app y 16 millones de colores",
      price: 49.99,
      originalPrice: 49.99,
      discount: 0,
      category: "home",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.3,
      reviews: 156,
      stock: 12,
      tags: ["smart", "lighting", "home"],
    },
    {
      id: "6",
      name: "Zapatillas Running Pro",
      description: "Zapatillas profesionales para running con tecnología de amortiguación",
      price: 129.99,
      originalPrice: 159.99,
      discount: 19,
      category: "sports",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 445,
      stock: 30,
      tags: ["running", "shoes", "sports"],
    },
    {
      id: "7",
      name: "Auriculares Bluetooth",
      description: "Auriculares inalámbricos con cancelación de ruido activa",
      price: 199.99,
      originalPrice: 199.99,
      discount: 0,
      category: "electronics",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.4,
      reviews: 678,
      stock: 20,
      tags: ["headphones", "bluetooth", "audio"],
    },
    {
      id: "8",
      name: "Jeans Slim Fit",
      description: "Jeans de corte slim con elastano para mayor comodidad",
      price: 79.99,
      originalPrice: 79.99,
      discount: 0,
      category: "clothing",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.2,
      reviews: 234,
      stock: 40,
      tags: ["jeans", "denim", "casual"],
    },
  ]

  let filteredProducts = mockProducts

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  if (query) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  return filteredProducts
}

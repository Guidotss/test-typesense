export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  image: string
  rating: number
  reviews: number
  stock: number
  tags: string[]
}

export interface TypesenseSearchResult {
  found: number
  hits: Array<{
    document: Product
    highlight?: Record<string, any>
  }>
}

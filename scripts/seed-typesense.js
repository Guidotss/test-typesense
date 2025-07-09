  
const Typesense = require('typesense')

const typesenseConfig = {
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2,
}

const productSchema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'price', type: 'float' },
    { name: 'originalPrice', type: 'float' },
    { name: 'discount', type: 'int32' },
    { name: 'category', type: 'string', facet: true },
    { name: 'image', type: 'string' },
    { name: 'rating', type: 'float' },
    { name: 'reviews', type: 'int32' },
    { name: 'stock', type: 'int32' },
    { name: 'tags', type: 'string[]', facet: true },
  ],
  default_sorting_field: 'rating',
}

const sampleProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'El último iPhone con chip A17 Pro y cámara de 48MP',
    price: 999.99,
    originalPrice: 1099.99,
    discount: 9,
    category: 'electronics',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    reviews: 1250,
    stock: 15,
    tags: ['smartphone', 'apple', 'premium'],
    brand: 'Apple',
    created_at: 1717977600,
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    description: 'Laptop ultradelgada con chip M2 y pantalla Liquid Retina',
    price: 1199.99,
    originalPrice: 1199.99,
    discount: 0,
    category: 'electronics',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    reviews: 890,
    stock: 8,
    tags: ['laptop', 'apple', 'productivity'],
    brand: 'Apple',
    created_at: 1717977600,
  },
  {
    id: '3',
    name: 'Camiseta Premium Cotton',
    description: 'Camiseta 100% algodón orgánico, suave y cómoda',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: 'clothing',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.5,
    reviews: 324,
    stock: 50,
    tags: ['shirt', 'cotton', 'casual'],
    brand: 'EcoWear',
    created_at: 1717977600,
  },
  {
    id: '4',
    name: 'El Arte de la Guerra',
    description: 'Clásico libro de estrategia militar y empresarial',
    price: 15.99,
    originalPrice: 15.99,
    discount: 0,
    category: 'books',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.7,
    reviews: 2100,
    stock: 25,
    tags: ['strategy', 'classic', 'business'],
    brand: 'Editorial Clásicos',
    created_at: 1717977600,
  },
  {
    id: '5',
    name: 'Lámpara LED Inteligente',
    description: 'Lámpara con control por app y 16 millones de colores',
    price: 49.99,
    originalPrice: 49.99,
    discount: 0,
    category: 'home',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.3,
    reviews: 156,
    stock: 12,
    tags: ['smart', 'lighting', 'home'],
    brand: 'SmartHome',
    created_at: 1717977600,
  },
  {
    id: '6',
    name: 'Zapatillas Running Pro',
    description: 'Zapatillas profesionales para running con tecnología de amortiguación',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    category: 'sports',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.6,
    reviews: 445,
    stock: 30,
    tags: ['running', 'shoes', 'sports'],
    brand: 'RunPro',
    created_at: 1717977600,
  },
  {
    id: '7',
    name: 'Auriculares Bluetooth',
    description: 'Auriculares inalámbricos con cancelación de ruido activa',
    price: 199.99,
    originalPrice: 199.99,
    discount: 0,
    category: 'electronics',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.4,
    reviews: 678,
    stock: 20,
    tags: ['headphones', 'bluetooth', 'audio'],
    brand: 'SoundMax',
    created_at: 1717977600,
  },
  {
    id: '8',
    name: 'Jeans Slim Fit',
    description: 'Jeans de corte slim con elastano para mayor comodidad',
    price: 79.99,
    originalPrice: 79.99,
    discount: 0,
    category: 'clothing',
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.2,
    reviews: 234,
    stock: 40,
    tags: ['jeans', 'denim', 'casual'],
    brand: 'DenimCo',
    created_at: 1717977600,
  },
]

async function initializeTypesense() {
  try {
    const client = new Typesense.Client(typesenseConfig)

    console.log('🔍 Conectando a Typesense...')

    try {
      await client.collections('products').retrieve()
      console.log('✅ La colección "products" ya existe')
    } catch (error) {
      console.log('📝 Creando colección "products"...')
      await client.collections().create(productSchema)
      console.log('✅ Colección "products" creada exitosamente')
    }

    console.log('📦 Insertando productos...')
    for (const product of sampleProducts) {
      try {
        await client.collections('products').documents().create(product)
        console.log(`✅ Producto "${product.name}" insertado`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Producto "${product.name}" ya existe`)
        } else {
          console.error(`❌ Error insertando "${product.name}":`, error.message)
        }
      }
    }

    console.log('🎉 ¡Typesense inicializado exitosamente!')
    console.log('📊 Dashboard: http://localhost:8108/dashboard')
    console.log('🔍 API: http://localhost:8108')

  } catch (error) {
    console.error('❌ Error inicializando Typesense:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  initializeTypesense()
}

module.exports = { initializeTypesense }

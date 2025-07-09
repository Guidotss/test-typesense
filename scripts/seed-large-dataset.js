const Typesense = require('typesense')
const { faker } = require('@faker-js/faker')

const typesenseConfig = {
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 10,
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
    { name: 'brand', type: 'string', facet: true },
    { name: 'created_at', type: 'int64' },
  ],
  default_sorting_field: 'rating',
}

async function initializeLargeDataset() {
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

    console.log('📦 Listo para generar datos con Faker...')
    console.log('📊 Dashboard: http://localhost:8108/dashboard')

  } catch (error) {
    console.error('❌ Error inicializando Typesense:', error.message)
    process.exit(1)
  }
}

async function importDataInBatches(client, data, batchSize = 1000) {
  console.log(`📦 Importando ${data.length} productos en lotes de ${batchSize}...`)
  
  const batches = []
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize))
  }

  let imported = 0
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    try {
      const importResults = await client.collections('products').documents().import(batch)
      
      const successCount = importResults.filter(result => !result.error).length
      imported += successCount
      
      console.log(`✅ Lote ${i + 1}/${batches.length}: ${successCount}/${batch.length} productos importados`)
      console.log(`📊 Progreso: ${imported}/${data.length} (${Math.round((imported/data.length)*100)}%)`)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error en lote ${i + 1}:`, error.message)
    }
  }
  
  console.log(`🎉 Importación completada: ${imported} productos importados`)
}

function generateFakeProducts(count) {
  console.log(`🎲 Generando ${count} productos con Faker...`)
  
  const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'automotive']
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 'HP', 'Canon', 'Nikon', 'Puma', 'Reebok']
  
  const products = []
  
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories)
    const brand = faker.helpers.arrayElement(brands)
    const price = parseFloat(faker.commerce.price({ min: 10, max: 2000 }))
    const originalPrice = price + parseFloat(faker.commerce.price({ min: 0, max: 500 }))
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)) // 3.0 - 5.0
    const reviews = Math.floor(Math.random() * 10000) + 10
    
    const product = {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      category: category,
      image: `/placeholder.svg?height=300&width=300`,
      rating: rating,
      reviews: reviews,
      stock: Math.floor(Math.random() * 100) + 1,
      tags: faker.helpers.arrayElements(['premium', 'new', 'trending', 'popular', 'featured', 'limited'], { min: 1, max: 3 }),
      brand: brand,
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 365 * 24 * 60 * 60), // Último año
    }
    
    products.push(product)
  }
  
  console.log(`✅ ${products.length} productos generados`)
  return products
}

if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('🚀 Inicializando Typesense para dataset grande...')
    initializeLargeDataset()
  } else if (args[0] === 'generate' && args[1]) {
    const count = parseInt(args[1])
    if (isNaN(count) || count <= 0) {
      console.error('❌ Por favor especifica un número válido de productos')
      process.exit(1)
    }
    
    console.log(`📦 Generando ${count} productos con Faker...`)
    const client = new Typesense.Client(typesenseConfig)
    const products = generateFakeProducts(count)
    importDataInBatches(client, products)
      .catch(error => {
        console.error('❌ Error importando datos:', error.message)
        process.exit(1)
      })
  } else {
    console.log('Uso:')
    console.log('  node scripts/seed-large-dataset.js                    # Inicializar colección')
    console.log('  node scripts/seed-large-dataset.js generate <número>  # Generar N productos con Faker')
    console.log('')
    console.log('Ejemplos:')
    console.log('  node scripts/seed-large-dataset.js generate 1000      # Generar 1,000 productos')
    console.log('  node scripts/seed-large-dataset.js generate 10000     # Generar 10,000 productos')
    console.log('  node scripts/seed-large-dataset.js generate 100000    # Generar 100,000 productos')
  }
}

module.exports = { initializeLargeDataset, importDataInBatches, generateFakeProducts } 
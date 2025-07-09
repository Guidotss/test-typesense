const Typesense = require('typesense')
const fs = require('fs')
const path = require('path')

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

    console.log('📦 Listo para importar datos...')
    console.log('💡 Usa este script con tu dataset de 15GB')
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

async function readDataFromFile(filePath) {
  console.log(`📖 Leyendo datos desde: ${filePath}`)
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`)
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const lines = fileContent.split('\n').filter(line => line.trim())
  
  console.log(`📊 Encontradas ${lines.length} líneas de datos`)
  
  const products = []
  for (let i = 0; i < lines.length; i++) {
    try {
      const product = JSON.parse(lines[i])
      products.push(product)
    } catch (error) {
      console.warn(`⚠️  Error parseando línea ${i + 1}:`, error.message)
    }
  }
  
  return products
}

if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('🚀 Inicializando Typesense para dataset grande...')
    initializeLargeDataset()
  } else if (args[0] === 'import' && args[1]) {
    console.log('📦 Importando dataset...')
    const client = new Typesense.Client(typesenseConfig)
    readDataFromFile(args[1])
      .then(data => importDataInBatches(client, data))
      .catch(error => {
        console.error('❌ Error importando datos:', error.message)
        process.exit(1)
      })
  } else {
    console.log('Uso:')
    console.log('  node scripts/seed-large-dataset.js                    # Inicializar colección')
    console.log('  node scripts/seed-large-dataset.js import <archivo>   # Importar datos')
  }
}

module.exports = { initializeLargeDataset, importDataInBatches, readDataFromFile } 
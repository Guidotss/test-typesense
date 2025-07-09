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

async function exploreDatabase() {
  try {
    const client = new Typesense.Client(typesenseConfig)
    
    console.log('🔍 Conectando a Typesense...')
    
    const collections = await client.collections().retrieve()
    console.log('\n📚 Colecciones disponibles:')
    collections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.num_documents} documentos)`)
    })
    
    const productsCollection = await client.collections('products').retrieve()
    console.log('\n📦 Detalles de la colección "products":')
    console.log(`  - Documentos: ${productsCollection.num_documents}`)
    console.log(`  - Campos: ${productsCollection.fields.length}`)
    console.log(`  - Tamaño: ${(productsCollection.num_documents * 0.001).toFixed(2)} MB (aprox)`)
    

    const searchResults = await client.collections('products').documents().search({
      q: '*',
      per_page: 5
    })
    
    console.log('\n📄 Primeros 5 documentos:')
    searchResults.hits.forEach((hit, index) => {
      const doc = hit.document
      console.log(`\n  ${index + 1}. ${doc.name}`)
      console.log(`     Precio: $${doc.price}`)
      console.log(`     Categoría: ${doc.category}`)
      console.log(`     Rating: ${doc.rating}/5 (${doc.reviews} reviews)`)
      console.log(`     Stock: ${doc.stock}`)
    })
    
    const categoryStats = await client.collections('products').documents().search({
      q: '*',
      facet_by: 'category',
      per_page: 0
    })
    
    console.log('\n🏷️  Estadísticas por categoría:')
    if (categoryStats.facet_counts && categoryStats.facet_counts[0]) {
      categoryStats.facet_counts[0].counts.forEach(count => {
        console.log(`  - ${count.value}: ${count.count} productos`)
      })
    }
    
    const brandStats = await client.collections('products').documents().search({
      q: '*',
      facet_by: 'brand',
      per_page: 0
    })
    
    console.log('\n🏭 Estadísticas por marca:')
    if (brandStats.facet_counts && brandStats.facet_counts[0]) {
      brandStats.facet_counts[0].counts.forEach(count => {
        console.log(`  - ${count.value}: ${count.count} productos`)
      })
    }
    
    console.log('\n✅ Exploración completada!')
    
  } catch (error) {
    console.error('❌ Error explorando la base de datos:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  exploreDatabase()
}

module.exports = { exploreDatabase } 
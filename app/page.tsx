import { Suspense } from "react"
import ProductGrid from "@/components/product-grid"
import SearchBar from "@/components/search-bar"
import CategoryFilter from "@/components/category-filter"
import { ShoppingBag } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TypeStore</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Descubre nuestros productos</h2>
          <p className="text-gray-600 mb-6">Busca y filtra entre nuestra amplia selección de productos</p>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter />
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </main>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
          <div className="bg-gray-300 h-4 rounded mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-gray-300 h-6 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

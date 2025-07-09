import { Suspense } from "react"
import ProductGrid from "@/components/product-grid"
import SearchBar from "@/components/search-bar"
import CategoryFilter from "@/components/category-filter"

export default function Home({ searchParams }: { searchParams: any }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="mb-6">
            <SearchBar />
          </div>
          <div className="mb-8">
            <CategoryFilter />
          </div>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid searchParams={searchParams} />
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

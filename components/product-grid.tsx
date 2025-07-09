import { searchProducts } from "@/lib/typesense"
import ProductCard from "./product-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface ProductGridProps {
  searchParams?: {
    q?: string
    category?: string
    page?: string
  }
}

const PER_PAGE = 20

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const query = searchParams?.q || ""
  const category = searchParams?.category || ""
  const page = parseInt(searchParams?.page || "1", 10)

  const { products, total } = await searchProducts(query, category, page, PER_PAGE)
  const totalPages = Math.ceil(total / PER_PAGE)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-500">Intenta con otros términos de búsqueda o categorías.</p>
      </div>
    )
  }


  function getPageUrl(newPage: number) {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    if (newPage > 1) params.set("page", String(newPage))
    return `/?${params.toString()}`
  }

  function renderPagination() {
    if (totalPages <= 1) return null
    const currentPage = page
    const pageLinks = []
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, currentPage + 2)
    if (currentPage <= 3) end = Math.min(5, totalPages)
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4)
    for (let i = start; i <= end; i++) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink href={getPageUrl(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(currentPage - 1)} />
            </PaginationItem>
          )}
          {start > 1 && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
            </PaginationItem>
          )}
          {start > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pageLinks}
          {end < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {end < totalPages && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          )}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={getPageUrl(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {total} producto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {renderPagination()}
    </div>
  )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", name: "Todos", count: 0 },
  { id: "electronics", name: "Electrónicos", count: 12 },
  { id: "clothing", name: "Ropa", count: 8 },
  { id: "books", name: "Libros", count: 15 },
  { id: "home", name: "Hogar", count: 6 },
  { id: "sports", name: "Deportes", count: 9 },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    if (categoryId === "all") {
      params.delete("category")
    } else {
      params.set("category", categoryId)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? "default" : "outline"}
          onClick={() => handleCategoryChange(category.id)}
          className="rounded-full"
        >
          {category.name}
          {category.count > 0 && (
            <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
          )}
        </Button>
      ))}
    </div>
  )
}

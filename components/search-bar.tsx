"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface PreviewProduct {
  id: string
  name: string
  image: string
  price: number
}

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [preview, setPreview] = useState<PreviewProduct[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    router.push(`/?${params.toString()}`)
  }, 300)

  useEffect(() => {
    if (query.trim().length === 0) {
      setPreview([])
      setShowPreview(false)
      return
    }
    const fetchPreview = async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setPreview(data)
        setShowPreview(data.length > 0)
      }
    }
    fetchPreview()
  }, [query])

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const clearSearch = () => {
    setQuery("")
    setPreview([])
    setShowPreview(false)
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    router.push(`/?${params.toString()}`)
  }
  
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!inputRef.current) return
      if (!(e.target instanceof Node)) return
      if (!inputRef.current.parentElement?.contains(e.target)) {
        setShowPreview(false)
      }
    }
    if (showPreview) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showPreview])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowPreview(preview.length > 0)}
          className="pl-10 pr-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showPreview && preview.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul>
            {preview.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  setQuery(product.name)
                  setShowPreview(false)
                  router.push(`/?q=${encodeURIComponent(product.name)}`)
                }}
              >
                <img
                  src={product.image || "/placeholder.svg?height=40&width=40"}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">${product.price.toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

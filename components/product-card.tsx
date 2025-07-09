import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={product.image || `/placeholder.svg?height=300&width=300`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.discount && <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>}
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>

          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="text-sm text-gray-600">Stock: {product.stock}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.stock === 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}

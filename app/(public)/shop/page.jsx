'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { useState } from "react"
import FilterSidebar from "@/components/store/FilterSidebar"

function ShopContent() {
   
  const [filters, setFilters] = useState({
  categories: [],
  minPrice: 0,
  maxPrice: 100000,
  minRating: 0,
  minDiscount: 0,
  })
  
  const getDiscount = (product) => {
  const mrp = Number(product.mrp)
  const price = Number(product.price)
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

    


    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    const filteredProducts = products.filter(product => {
  const discount = getDiscount(product)

  if (
    filters.categories.length &&
    !filters.categories.includes(product.category)
  ) return false

  if (product.price > filters.maxPrice) return false

  if (filters.minRating > 0) {
    const avgRating =
      product.rating.length
        ? product.rating.reduce((a, r) => a + r.rating, 0) / product.rating.length
        : 0
    if (avgRating < filters.minRating) return false
  }

  if (filters.minDiscount > 0 && discount < filters.minDiscount) {
    return false
  }

  return true
})


    return (
        <div className="min-h-[60vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1
  onClick={() => router.push('/shop')}
  className="
    my-6
    cursor-pointer
    font-serif
    text-[1.9rem]
    sm:text-[2.3rem]
    md:text-5xl
    lg:text-6xl
    text-[#1A1614]
    tracking-tight
    leading-[1.15]
    transition-all
    duration-[1500ms]
    flex
    items-center
    gap-2
  "
>
  {search && <MoveLeftIcon size={20} className="text-slate-500" />}

  <span>
    <br className="hidden xs:block" />
    <span
      className="
        italic
        text-[#C5A059]/80
        block
        mt-1
        pl-0
        sm:pl-4
        md:pl-8
      "
    >
      all products
    </span>
  </span>
                </h1>

                <div className="flex gap-8 mt-8">
  {/* Sidebar */}
  <FilterSidebar filters={filters} setFilters={setFilters} />

  {/* Products */}
  <div className="flex-1">
    {filteredProducts.length === 0 ? (
      <div className="text-center text-slate-400 mt-20">
        <h2 className="text-xl font-medium">No products found</h2>
        <p className="text-sm mt-2">Try adjusting your filters</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )}
  </div>
                </div>

            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
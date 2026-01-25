'use client'

import { Suspense, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import FilterSidebar from "@/components/store/FilterSidebar"

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search")

  const products = useSelector(state => state.product.list)

  /* ---------------- FILTER STATE ---------------- */
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    minDiscount: 0,
  })

  const [showFilters, setShowFilters] = useState(false)

  /* ---------------- HELPERS ---------------- */
  const getDiscount = (product) => {
    const mrp = Number(product.mrp)
    const price = Number(product.price)
    if (!mrp || mrp <= price) return 0
    return Math.round(((mrp - price) / mrp) * 100)
  }

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
          ? product.rating.reduce((a, r) => a + r.rating, 0) /
            product.rating.length
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
      <div className="max-w-7xl mx-auto">

        {/* ---------- HEADING ---------- */}
        <h1
          onClick={() => router.push("/shop")}
          className="
            my-6 cursor-pointer font-serif
            text-[1.9rem] sm:text-[2.3rem] md:text-5xl lg:text-6xl
            text-[#1A1614]
            tracking-tight leading-[1.15]
            flex items-center gap-2
          "
        >
          {search && <MoveLeftIcon size={20} className="text-slate-500" />}
          <span className="italic text-[#C5A059]/80 block mt-1">
            all products
          </span>
        </h1>

        {/* ---------- MOBILE FILTER BUTTON ---------- */}
        <div className="sm:hidden flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="
              px-4 py-2
              text-sm
              border border-[#ede6dd]
              rounded-md
              text-[#6b5d52]
              bg-white
            "
          >
            Filters
          </button>
        </div>

        <div className="flex gap-8 mt-8">

          {/* ---------- DESKTOP SIDEBAR ---------- */}
          <div className="hidden sm:block">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* ---------- PRODUCTS ---------- */}
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

        {/* ---------- MOBILE FILTER MODAL ---------- */}
        {showFilters && (
          <div className="fixed inset-0 z-50 sm:hidden">
            {/* Backdrop */}
            <div
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <div
              className="
                absolute bottom-0 left-0 right-0
                bg-[#fefdfb]
                rounded-t-2xl
                max-h-[85vh]
                overflow-y-auto
                p-5
                animate-slideUp
              "
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#6b5d52]">
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-sm text-[#6b5d52]"
                >
                  Close
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="
                  w-full mt-4
                  bg-[#6b5d52]
                  text-white
                  py-2
                  rounded-md
                  text-sm
                "
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}

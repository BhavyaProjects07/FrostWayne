'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    const filteredProducts = search
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products;

    return (
        <div className="min-h-[60vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />} <h2
  className="
    font-serif
    text-[1.9rem]        /* small mobile */
    sm:text-[2.3rem]
    md:text-5xl
    lg:text-6xl
    text-[#1A1614]
    tracking-tight
    leading-[1.15]
    transition-all
    duration-[1500ms]
    opacity-100
    translate-y-0
  "
>
  
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
                    </h2></h1>
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
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
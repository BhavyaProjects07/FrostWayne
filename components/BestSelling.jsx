'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title={
                    <h2
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
  Our Best Selling
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
    from the Atelier
  </span>
                    </h2>

                } description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling
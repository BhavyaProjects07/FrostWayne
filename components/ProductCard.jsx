'use client'

import { StarIcon } from 'lucide-react'
import React from 'react'
import { Plus, ArrowUpRight } from 'lucide-react'

/**
 * Frost Wayne | Luxury Product Card (Atelier Edition)
 * A refined, high-fashion gallery component.
 */
const ProductCard = ({ product }) => {
    // Default values if product prop is partial
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const productName = product?.name || "Untitled Piece"
    const productPrice = product?.price || "0.00"
    const productImage = product?.images?.[0] || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800"
    const productId = product?.id || "000"
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <a 
            href={`/product/${productId}`} 
            className='group relative block w-full max-w-[280px] mx-auto bg-transparent'
        >
            {/* Top Micro-Metadata */}
            <div className="flex justify-between items-end mb-3 px-1 overflow-hidden">
                <div className="flex flex-col transform transition-transform duration-700 group-hover:-translate-y-1">
                    <span className="text-[7px] tracking-[0.4em] text-[#C5A059] uppercase font-bold leading-none mb-1">Archive Ref.</span>
                    <span className="text-[9px] tracking-[0.1em] text-[#1A1614]/50 font-mono">FW-25-{String(productId).padStart(3, '0')}</span>
                </div>
                <div className="flex flex-col items-end transform transition-transform duration-700 group-hover:-translate-y-1">
                    <span className="text-[7px] tracking-[0.4em] text-[#C5A059] uppercase font-bold leading-none mb-1">Origin</span>
                    <span className="text-[9px] tracking-[0.1em] text-[#1A1614]/50 font-mono uppercase">Milan Atelier</span>
                </div>
            </div>

            {/* Visual Canvas (The Frame) */}
            <div className='relative aspect-[4/5] w-full bg-[#F7F3F0] overflow-hidden border border-[#D4C4B5]/20 transition-colors duration-1000 group-hover:border-[#C5A059]/40'>
                {/* Texture Layer */}
                <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                
                {/* Image Container with Parallax-lite effect */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-8 transition-transform duration-[1.5s] cubic-bezier(0.2, 1, 0.3, 1) group-hover:scale-110">
                    <img 
                        src={productImage} 
                        alt={productName}
                        className='w-full h-full object-contain drop-shadow-2xl'
                    />
                </div>

                {/* The "Presentation" Frame (reveals on hover) */}
                <div className="absolute inset-0 z-30 m-3 border border-[#C5A059]/0 scale-95 transition-all duration-1000 cubic-bezier(0.2, 1, 0.3, 1) group-hover:border-[#C5A059]/30 group-hover:scale-100 pointer-events-none"></div>

                {/* Corner Details (Architectural) */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#C5A059]/40 z-30"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#C5A059]/40 z-30"></div>

                {/* Hover Quick Action */}
                <div className="absolute inset-0 z-40 bg-[#1A1614]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#1A1614] text-[#C5A059] flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 delay-100">
                        <ArrowUpRight size={16} />
                    </div>
                </div>
            </div>

            {/* Editorial Content */}
            <div className='mt-5 relative overflow-hidden'>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        {/* Material Label */}
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-[1px] bg-[#C5A059]"></div>
                            <span className="text-[8px] tracking-[0.4em] text-[#C5A059] uppercase font-bold">Pure Composition</span>
                        </div>
                        
                        {/* Product Title */}
                        <h3 className='font-serif text-xl md:text-2xl text-[#1A1614] leading-tight tracking-tight transition-colors duration-700 group-hover:text-[#856358]'>
                            {productName}
                        </h3>

                        <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#856358ff" : "#c9bbae"} />
                        ))}
                    </div>
                        

                        
                    </div>
                    
                    

                    {/* Price with slide animation */}
                    <div className="flex flex-col items-end h-10 overflow-hidden">
                        <div className="transition-transform duration-700 group-hover:-translate-y-full flex flex-col items-end">
                            <span className="text-[12px] font-medium tracking-wider text-[#1A1614] h-10 flex items-center">
                                {currency}{productPrice}
                            </span>
                            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C5A059] font-bold h-10 flex items-center">
                                Discover Piece
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="h-[1px] flex-1 bg-[#C5A059]/10">
                        <div className="h-full w-0 bg-[#C5A059] group-hover:w-full transition-all duration-1000 ease-out"></div>
                    </div>
                    <div className="ml-4 flex space-x-1">
                         <div className="w-[3px] h-[3px] rounded-full bg-[#C5A059]/20 group-hover:bg-[#C5A059] transition-colors duration-500"></div>
                         <div className="w-[3px] h-[3px] rounded-full bg-[#C5A059]/20 group-hover:bg-[#C5A059] transition-colors duration-700 delay-100"></div>
                         <div className="w-[3px] h-[3px] rounded-full bg-[#C5A059]/20 group-hover:bg-[#C5A059] transition-colors duration-1000 delay-200"></div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default ProductCard
'use client'

import { addToCart } from "@/lib/features/cart/cartSlice"
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import Counter from "./Counter"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const FootSizes = ["UK-5", "UK-6", "UK-7", "UK-8", "UK-9", "UK-10", "UK-11"]

const ProductDetails = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"
    const productId = product.id

    const isFootwear = product?.sizes
  ? Object.keys(product.sizes).some(size => size.startsWith("UK-"))
  : false

    const sizeList = isFootwear ? FootSizes : SIZES


  const cart = useSelector(state => state.cart.cartItems)
  const dispatch = useDispatch()
  const router = useRouter()

  const [mainImage, setMainImage] = useState(product.images[0])
  const [selectedSize, setSelectedSize] = useState(null)

  const discountPercentage =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  const averageRating =
    product.rating.length > 0
      ? product.rating.reduce((acc, item) => acc + item.rating, 0) /
        product.rating.length
      : 0

  const addToCartHandler = () => {
    if (product.hasSizes && !selectedSize) {
      return toast.error("Please select a size")
    }

    dispatch(addToCart({
      productId,
        size: selectedSize || null,
      hasSize : true
    }))
  }

  return (
    <div className="flex max-lg:flex-col gap-12">
      {/* IMAGES */}
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(image)}
              className="bg-[#F7F3F0] flex items-center justify-center size-26 rounded-lg cursor-pointer"
            >
              <Image src={image} alt="" width={45} height={45} />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center sm:size-113 bg-[#F7F3F0] rounded-lg">
          <Image src={mainImage} alt="" width={280} height={280} />
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-[#C5A059]/80">
          {product.name}
        </h1>

        {/* RATING */}
        <div className="flex items-center mt-2">
          {Array(5).fill("").map((_, i) => (
            <StarIcon
              key={i}
              size={14}
              fill={averageRating >= i + 1 ? "#824938" : "#c0b3ab"}
              className="text-transparent"
            />
          ))}
          <p className="text-sm ml-3 text-slate-500">
            {product.rating.length} Reviews
          </p>
        </div>

        {/* PRICE */}
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold">
          <p>{currency}{product.price}</p>
          <p className="text-xl text-slate-500 line-through">
            {currency}{product.mrp}
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>Save {discountPercentage}% right now</p>
        </div>

        {/* ================= SIZES ================= */}
        {product.hasSizes && product.sizes && (
  <div className="mt-8">
    <p className="text-lg font-semibold text-[#c5a059] mb-3">
      Select Size
    </p>

    <div className="flex gap-3 flex-wrap">
      {sizeList.map(size => {
        const available = product.sizes[size]

        return (
          <button
            key={size}
            disabled={!available}
            onClick={() => available && setSelectedSize(size)}
            className={`
              relative w-14 h-12 rounded-md border
              text-sm font-medium
              flex items-center justify-center
              transition
              ${
                selectedSize === size
                  ? "border-[#654321] bg-[#654321] text-white"
                  : "border-slate-300 text-slate-600"
              }
              ${available ? "hover:border-[#654321]" : "opacity-40 cursor-not-allowed"}
            `}
          >
            {size}

            {!available && (
              <span className="absolute inset-0 pointer-events-none">
                <span className="absolute w-[150%] h-[1px] bg-slate-400 rotate-[-45deg] top-1/2 left-[-25%]" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  </div>
        )}


        {/* CART */}
        <div className="flex items-end gap-5 mt-10">
          {cart[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-[#c5a059] font-semibold">
                Quantity
              </p>
              <Counter productId={productId} />
            </div>
          )}

          <button
            onClick={() =>
              !cart[productId] ? addToCartHandler() : router.push("/cart")
            }
            className="bg-[#654321] text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
          >
            {!cart[productId] ? "Add to Cart" : "View Cart"}
         </button>
                  
        
                  

        </div>

        <hr className="border-gray-300 my-6" />

        {/* TRUST */}
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3"><EarthIcon /> Free shipping worldwide</p>
          <p className="flex gap-3"><CreditCardIcon /> Secure payments</p>
          <p className="flex gap-3"><UserIcon /> Trusted by premium brands</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

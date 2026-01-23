"use client"

import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useSearchParams, useRouter } from "next/navigation"

export default function StoreAddProduct() {
  const router = useRouter()
  const { getToken } = useAuth()

  /* ---------------- SIZE STATES ---------------- */
  const [enableSizes, setEnableSizes] = useState(false)

  const [sizes, setSizes] = useState({
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    XXL: false,
    "UK-5": false,
    "UK-6": false,
    "UK-7": false,
    "UK-8": false,
    "UK-9": false,
    "UK-10": false,
    "UK-11": false,
  })

  /* ---------------- PRODUCT STATE ---------------- */
  const categories = [
    "Electronics",
    "Clothing",
    "Mens-Clothing",
    "Womens-Clothing",
    "Footwear",
    "Accessories", 
    "Beauty & Health",
   
  ]

  const searchParams = useSearchParams()
  const editProductId = searchParams.get("edit")
  const isEditMode = !!editProductId

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    category: "",
  })

  const [loading, setLoading] = useState(false)
  const [aiUsed, setAiUsed] = useState(false)

  /* ---------------- HANDLERS ---------------- */
  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (key, file) => {
    setImages(prev => ({ ...prev, [key]: file }))

    if (key == "1" && file && !aiUsed) {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = async () => {
        try {
          const token = await getToken()
          const base64String = reader.result.split(",")[1]

          await toast.promise(
            axios.post(
              "/api/store/ai",
              {
                base64Image: base64String,
                mimeType: file.type,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            {
              loading: "Analyzing Image with AI...",
              success: (res) => {
                if (res.data?.name && res.data?.description) {
                  setProductInfo(prev => ({
                    ...prev,
                    name: res.data.name,
                    description: res.data.description,
                  }))
                  setAiUsed(true)
                  return "AI filled product info"
                }
                return "AI could not analyze image"
              },
              error: err => err?.response?.data?.error || err.message,
            }
          )
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  /* ---------------- SUBMIT ---------------- */
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!images[1] && !images[2] && !images[3] && !images[4]) {
      return toast.error("Please upload at least one product image.")
    }

    try {
      setLoading(true)
      const token = await getToken()

      const formData = new FormData()
      Object.entries(productInfo).forEach(([k, v]) =>
        formData.append(k, v)
      )

      Object.keys(images).forEach(key => {
        images[key] && formData.append("images", images[key])
      })

      // 👇 SIZE DATA
      formData.append("hasSizes", enableSizes)
      formData.append("sizes", JSON.stringify(sizes))

      const endpoint = isEditMode
        ? `/api/store/product/${editProductId}`
        : "/api/store/product"

      const method = isEditMode ? "put" : "post"

      const { data } = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(data.message)
      router.push("/store/manage-product")
    } catch (err) {
      toast.error(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- EDIT PREFILL ---------------- */
  useEffect(() => {
    if (!isEditMode) return

    const fetchProduct = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(
          `/api/store/product/${editProductId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const product = data.product

        setProductInfo({
          name: product.name,
          description: product.description,
          mrp: product.mrp,
          price: product.price,
          category: product.category,
        })

        setEnableSizes(product.hasSizes || false)
        if (product.sizes) setSizes(product.sizes)

        setImages(
          product.images.reduce((acc, url, i) => {
            acc[i + 1] = url
            return acc
          }, {})
        )
      } catch {
        toast.error("Failed to load product")
      }
    }

    fetchProduct()
  }, [editProductId])

  /* ---------------- UI ---------------- */
  return (
    <form
      onSubmit={(e) =>
        toast.promise(onSubmitHandler(e), { loading: "Saving Product..." })
      }
      className="text-[#9a8978] mb-28"
    >
      <h1 className="text-2xl mb-8">
        {isEditMode ? "Update" : "Add New"}{" "}
        <span className="text-[#6b5d52] font-medium">Product</span>
      </h1>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="flex gap-14 items-start">
        {/* ===== LEFT: PRODUCT INFO ===== */}
        <div className="flex-1 max-w-xl">
          <p>Product Images</p>

          <div className="flex gap-3 mt-4">
            {Object.keys(images).map((key) => (
              <label key={key}>
                <Image
                  width={120}
                  height={120}
                  className="h-20 w-auto border border-[#ede6dd] rounded cursor-pointer"
                  src={
                    typeof images[key] === "string"
                      ? images[key]
                      : images[key]
                      ? URL.createObjectURL(images[key])
                      : assets.upload_area
                  }
                  alt=""
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(key, e.target.files[0])
                  }
                />
              </label>
            ))}
          </div>

          <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Name
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 outline-none border border-[#ede6dd] rounded text-[#6b5d52] bg-white"
          required
        />
      </label>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 outline-none border border-[#ede6dd] rounded resize-none text-[#6b5d52] bg-white"
          required
        />
      </label>

      <div className="flex gap-5">
        <label htmlFor="" className="flex flex-col gap-2 ">
          Actual Price ($)
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-[#ede6dd] rounded resize-none text-[#6b5d52] bg-white"
            required
          />
        </label>
        <label htmlFor="" className="flex flex-col gap-2 ">
          Offer Price ($)
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-[#ede6dd] rounded resize-none text-[#6b5d52] bg-white"
            required
          />
        </label>
      </div>

      <select
        onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
        value={productInfo.category}
        className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-[#ede6dd] rounded text-[#6b5d52] bg-white"
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
        </div>

        {/* ===== RIGHT: SIZE PANEL ===== */}
        <div className="w-[320px] border border-[#ede6dd] rounded-xl p-5 bg-white">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enableSizes}
              onChange={() => setEnableSizes(v => !v)}
            />
            Enable Size Parameters
          </label>

          {enableSizes && (
            <div className="grid grid-cols-3 gap-3 mt-5">
              {Object.keys(sizes).map(size => (
                <label
                  key={size}
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={sizes[size]}
                    onChange={() =>
                      setSizes(prev => ({
                        ...prev,
                        [size]: !prev[size],
                      }))
                    }
                  />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        disabled={loading}
        className="bg-[#6b5d52] text-white px-6 py-2 mt-10"
      >
        {isEditMode ? "Update Product" : "Add Product"}
      </button>
    </form>
  )
}

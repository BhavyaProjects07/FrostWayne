"use client"
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState , useEffect } from "react"
import { toast } from "react-hot-toast"
import { useSearchParams } from "next/navigation"

export default function StoreAddProduct() {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty & Health",
    "Toys & Games",
    "Sports & Outdoors",
    "Books & Media",
    "Food & Drink",
    "Hobbies & Crafts",
    "Others",
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

  const {getToken} = useAuth()

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
  }


  const handleImageUpload = async (key, file) => {
    setImages(prev => ({ ...prev, [key]: file }))
    if (key == "1" && file && !aiUsed) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1]
        const mimeType = file.type
        const token = await getToken()

        try {
          await toast.promise(
  axios.post(
    "/api/store/ai",
    {
      base64Image: base64String,
      mimeType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ),
  {
    loading: "Analyzing Image with AI...",
    success: (res) => {
      const data = res.data
      if (data.name && data.description) {
        setProductInfo(prev => ({
          ...prev,
          name: data.name,
          description: data.description,
        }))
        setAiUsed(true)
        return "AI filled product info"
      }
      return "AI could not analyze the image"
    },
    error: (err) => err?.response?.data?.error || err.message,
  }
)

        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      // if no Images are uploaded then return a message
      if (!images[1] && !images[2] && !images[3] && !images[4]) {
        return toast.error("Please upload at least one product image.")
        
      }
      setLoading(true)

      const formData = new FormData()
      formData.append("name", productInfo.name)
      formData.append("description", productInfo.description)
      formData.append("mrp", productInfo.mrp)
      formData.append("price", productInfo.price)
      formData.append("category", productInfo.category)

      // adding Images to formData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key])
      })

      const token = await getToken()

    //  ADD  LOGIC HERE
      const endpoint = isEditMode
        ? `/api/store/product/${editProductId}`
        : "/api/store/product"

      const method = isEditMode ? "put" : "post"

      // ✅ USE IT HERE
      const { data } = await axios[method](endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success(data.message)


      // reset form
      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
      })
      setImages({ 1: null, 2: null, 3: null, 4: null })
      router.push("/store/manage-product")
      setLoading(false)

    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    }
  }

  useEffect(() => {
  if (!isEditMode) return

  const fetchProduct = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(
        `/api/store/product/${editProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const product = data.product

      setProductInfo({
        name: product.name,
        description: product.description,
        mrp: product.mrp,
        price: product.price,
        category: product.category,
      })

      setImages(
        product.images.reduce((acc, url, i) => {
          acc[i + 1] = url
          return acc
        }, {})
      )
    } catch (err) {
      toast.error("Failed to load product")
    }
  }

  fetchProduct()
}, [editProductId])


  return (
    <form
      onSubmit={(e) => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })}
      className="text-[#9a8978] mb-28"
    >
      <h1 className="text-2xl">
        Add New <span className="text-[#6b5d52] font-medium">Products</span>
      </h1>
      <p className="mt-7">Product Images</p>

      <div htmlFor="" className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-15 w-auto border border-[#ede6dd] rounded cursor-pointer"
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
              accept="image/*"
              id={`images${key}`}
              onChange={(e) => handleImageUpload(key , e.target.files[0]) }
              hidden
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

      <br />

      <button disabled={loading} className="bg-[#6b5d52] text-white px-6 mt-7 py-2">
        {isEditMode ? "Update Product" : "Add Product"}
      </button>

    </form>
  )
}

"use client"
import { dummyStoreDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import { set } from "date-fns"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

export default function Dashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"
    const {getToken} = useAuth()

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  })

  const dashboardCardsData = [
    { title: "Total Products", value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
    { title: "Total Earnings", value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
    { title: "Total Orders", value: dashboardData.totalOrders, icon: TagsIcon },
    { title: "Total Ratings", value: dashboardData.ratings.length, icon: StarIcon },
  ]

  const fetchDashboardData = async () => {
    try {
        const token = await getToken()
        const {data} = await axios.get("/api/store/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setDashboardData(data)
        
        
    } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
    }
      setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className=" text-[#9a8978] mb-28">
      <h1 className="text-2xl">
        Seller <span className="text-[#6b5d52] font-medium">Dashboard</span>
      </h1>

      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-11 border border-[#ede6dd] bg-[#fefdfb] p-3 px-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-[#6b5d52]">{card.value}</b>
            </div>
            <card.icon size={50} className=" w-11 h-11 p-2.5 text-[#9a8978] bg-[#f0e8e0] rounded-full" />
          </div>
        ))}
      </div>

      <h2 className="text-[#6b5d52]">Total Reviews</h2>

      <div className="mt-5">
        {dashboardData.ratings.map((review, index) => (
          <div
            key={index}
            className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-[#ede6dd] text-sm text-[#9a8978] max-w-4xl"
          >
            <div>
              <div className="flex gap-3">
                <Image
                  src={review.user.image || "/placeholder.svg"}
                  alt=""
                  className="w-10 aspect-square rounded-full"
                  width={100}
                  height={100}
                />
                <div>
                  <p className="font-medium text-[#6b5d52]">{review.user.name}</p>
                  <p className="font-light text-[#9a8978]">{new Date(review.createdAt).toDateString()}</p>
                </div>
              </div>
              <p className="mt-3 text-[#9a8978] max-w-xs leading-6">{review.review}</p>
            </div>
            <div className="flex flex-col justify-between gap-6 sm:items-end">
              <div className="flex flex-col sm:items-end">
                <p className="text-[#9a8978]">{review.product?.category}</p>
                <p className="font-medium text-[#6b5d52]">{review.product?.name}</p>
                <div className="flex items-center">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={17}
                        className="text-transparent mt-0.5"
                        fill={review.rating >= index + 1 ? "#6b5d52" : "#e8dfd7"}
                      />
                    ))}
                </div>
              </div>
              <button
                onClick={() => router.push(`/product/${review.product.id}`)}
                className="bg-[#ede6dd] px-5 py-2 hover:bg-[#dcd2c8] text-[#6b5d52] rounded transition-all"
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

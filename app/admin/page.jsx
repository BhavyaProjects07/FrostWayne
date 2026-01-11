"use client"
import { useAuth } from "@clerk/nextjs"
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"
  const {getToken} = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  })

  const dashboardCardsData = [
    { title: "Total Products", value: dashboardData.products, icon: ShoppingBasketIcon },
    { title: "Total Revenue", value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
    { title: "Total Orders", value: dashboardData.orders, icon: TagsIcon },
    { title: "Total Stores", value: dashboardData.stores, icon: StoreIcon },
  ]

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDashboardData(data.dashboardData)
      setLoading(false)
    } catch (error) {
       toast.error(error?.response?.data?.message || error.message )
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="text-[#9a8978]">
      <h1 className="text-2xl">
        Admin <span className="text-[#6b5d52] font-medium">Dashboard</span>
      </h1>

      {/* Cards */}
      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-10 border border-[#d4c4b3] bg-white/60 backdrop-blur p-3 px-6 rounded-lg hover:bg-white/80 transition shadow-sm"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-[#6b5d52]">{card.value}</b>
            </div>
            <card.icon size={50} className=" w-11 h-11 p-2.5 text-[#9a8978] bg-[#ede6dd] rounded-full" />
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <OrdersAreaChart allOrders={dashboardData.allOrders} />
    </div>
  )
}

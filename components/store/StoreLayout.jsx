"use client"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { dummyStoreData } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import { set } from "date-fns"
import axios from "axios"

const StoreLayout = ({ children }) => {

  const { getToken } = useAuth()
  const [isStoreActive, setIsStoreActive] = useState(true)

  const [isSeller, setIsSeller] = useState(false)
  const [loading, setLoading] = useState(true)
  const [storeInfo, setStoreInfo] = useState(null)

  const fetchIsSeller = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get("/api/store/is-seller", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsSeller(data.isSeller)
      setStoreInfo(data.storeInfo)
      setIsStoreActive(data.isStoreActive)
        
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIsSeller()
  }, [])

  if (loading) {
    return <Loading />
  }

  /* ❌ Not a seller at all */
  if (!isSeller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#f9f7f4]">
        <h1 className="text-2xl sm:text-4xl font-semibold text-[#9a8978]">
          You are not authorized to access this page
        </h1>
        <Link
          href="/"
          className="bg-[#6b5d52] text-white flex items-center gap-2 mt-8 px-6 py-2 rounded-full hover:bg-[#5c4433]"
        >
          Go to home <ArrowRightIcon size={18} />
        </Link>
      </div>
    )
  }

  /* ⚠️ Seller exists but store is disabled by admin */
  if (!storeInfo?.isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#f9f7f4]">
        <h1 className="text-2xl sm:text-4xl font-semibold text-[#9a8978]">
          Your store has been temporarily disabled
        </h1>

        <p className="mt-4 max-w-xl text-[#6b5d52]">
          This action was taken by the administrator.
          If you believe this is a mistake, please contact support.
        </p>

        <Link
          href="/support"
          className="bg-[#6b5d52] text-white mt-8 px-6 py-2 rounded-full hover:bg-[#5c4433]"
        >
          Contact Support
        </Link>
      </div>
    )
  }

  /* ✅ Seller + Active Store */
  return (
    <div className="flex flex-col h-screen bg-[#f9f7f4]">
      <SellerNavbar />

      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <SellerSidebar storeInfo={storeInfo} />

        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

export default StoreLayout
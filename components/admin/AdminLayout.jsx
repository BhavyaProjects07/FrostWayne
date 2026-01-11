"use client"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useUser , useAuth } from "@clerk/nextjs"
import axios from "axios"
import { set } from "date-fns"


const AdminLayout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)


  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsAdmin(data.isAdmin)
      
    } catch (error) {
      console.log("Error", error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    if (user) {
      fetchIsAdmin()
    }

    
  }, [user])

  return loading ? (
    <Loading />
  ) : isAdmin ? (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede6dd]">
      <AdminNavbar />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <AdminSidebar />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">{children}</div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede6dd]">
      <h1 className="text-2xl sm:text-4xl font-semibold text-[#9a8978]">You are not authorized to access this page</h1>
      <Link
        href="/"
        className="bg-[#6b5d52] text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full hover:bg-[#5a4d44] transition"
      >
        Go to home <ArrowRightIcon size={18} />
      </Link>
    </div>
  )
}

export default AdminLayout

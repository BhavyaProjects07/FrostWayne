"use client"
import Link from "next/link"
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useUser , UserButton } from "@clerk/nextjs"
const StoreNavbar = () => {

  const {user} = useUser()


  return user && (
    <div className="flex items-center justify-between px-12 py-3 border-b border-[#fff] bg-gradient-to-r from-[#fff] to-[#fff] transition-all">
      <Link href="/" className="relative text-4xl font-semibold text-[#6b5d52]">
        <Image src={assets.logo || "/placeholder.svg"} alt="Logo" className="w-36 " />
      </Link>
      <div className="flex items-center gap-3 text-[#6b5d52]">
              <p>Hi, {user?.firstName}</p>
              <UserButton />
      </div>
    </div>
  )
}

export default StoreNavbar

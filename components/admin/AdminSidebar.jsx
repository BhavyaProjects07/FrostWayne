"use client"
import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {
  const pathname = usePathname()
  const {user} = useUser()

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Stores", href: "/admin/stores", icon: StoreIcon },
    { name: "Approve Store", href: "/admin/approve", icon: ShieldCheckIcon },
    { name: "Coupons", href: "/admin/coupons", icon: TicketPercentIcon },
  ]

  return user && (
    <div className="inline-flex h-full flex-col gap-5 border-r border-[#d4c4b3] bg-gradient-to-b from-[#f9f7f4] to-[#ede6dd] sm:min-w-60">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <Image
          className="w-14 h-14 rounded-full"
          src={user?.imageUrl || "/placeholder.svg"}
          alt=""
          width={80}
          height={80}
        />
        <p className="text-[#6b5d52] font-medium">Hi, {user.fullName || "GreatStack"}</p>
      </div>

      <div className="max-sm:mt-6">
        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`relative flex items-center gap-3 text-[#9a8978] hover:bg-[#e8dfd7] p-2.5 transition ${pathname === link.href && "bg-[#e0d5c8] sm:text-[#6b5d52]"}`}
          >
            <link.icon size={18} className="sm:ml-5" />
            <p className="max-sm:hidden">{link.name}</p>
            {pathname === link.href && (
              <span className="absolute bg-[#6b5d52] right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar

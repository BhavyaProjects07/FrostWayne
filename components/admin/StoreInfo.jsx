"use client"
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const StoreInfo = ({ store }) => {
  return (
    <div className="flex-1 space-y-2 text-sm">
      <Image
        width={100}
        height={100}
        src={store.logo || "/placeholder.svg"}
        alt={store.name}
        className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto"
      />
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <h3 className="text-xl font-semibold text-[#6b5d52]"> {store.name} </h3>
        <span className="text-sm text-[#9a8978]">@{store.username}</span>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold px-4 py-1 rounded-full ${
            store.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : store.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {store.status}
        </span>
      </div>

      <p className="text-[#9a8978] my-5 max-w-2xl">{store.description}</p>
      <p className="flex items-center gap-2 text-[#6b5d52]">
        {" "}
        <MapPin size={16} /> {store.address}
      </p>
      <p className="flex items-center gap-2 text-[#6b5d52]">
        <Phone size={16} /> {store.contact}
      </p>
      <p className="flex items-center gap-2 text-[#6b5d52]">
        <Mail size={16} /> {store.email}
      </p>
      <p className="text-[#6b5d52] mt-5">
        Applied on <span className="text-xs text-[#9a8978]">{new Date(store.createdAt).toLocaleDateString()}</span> by
      </p>
      <div className="flex items-center gap-2 text-sm ">
        <Image
          width={36}
          height={36}
          src={store.user.image || "/placeholder.svg"}
          alt={store.user.name}
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p className="text-[#6b5d52] font-medium">{store.user.name}</p>
          <p className="text-[#9a8978]">{store.user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default StoreInfo

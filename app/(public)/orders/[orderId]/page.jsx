
'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import { 
  Package, 
  MapPin, 
  ArrowLeft, 
  CreditCard,
  Truck,
  ShieldCheck,
  AlertCircle,
  ShoppingBag
} from "lucide-react"

export default function OrderViewDetailsPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹"
  const router = useRouter()

  const isReturnEligible = () => {
    if (!order || order.status !== "DELIVERED") return false
    const deliveredAt = new Date(order.updatedAt)
    const now = new Date()
    const diffHours = (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60)
    return diffHours <= 48 && !order.returnRequest
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`)
        setOrder(data.order)
      } catch (err) {
        console.error(err)
        toast.error("Unable to load order details.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) return <Loading />
  if (!order) return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center text-[#1A1614]">
      <AlertCircle className="text-[#C5A059] mb-4 opacity-50" size={48} />
      <h2 className="font-serif text-2xl mb-2 italic">Sequence Not Found</h2>
      <p className="text-sm opacity-60 mb-8 max-w-xs font-light">The requested order archive could not be located.</p>
      <button onClick={() => router.back()} className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold border-b border-[#C5A059]/40 pb-1">Return to Archive</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f1e9] text-[#1A1614] pt-32 pb-40 px-6 mb-20 font-light">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <nav className="mb-12">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#3D352F]/50 hover:text-[#1A1614] transition-all"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Order History</span>
          </button>
        </nav>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.5em] text-[#C5A059] uppercase font-bold">Confirmation</p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-[#1A1614]">
              Order <span className="italic">#{order.id.slice(-8).toUpperCase()}</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:items-end gap-3">
            <span className="text-[9px] tracking-[0.3em] text-[#3D352F]/40 uppercase">Current Status</span>
            <div className="px-6 py-2 border border-[#1A1614]/10 bg-white rounded-none shadow-sm flex items-center gap-3">
               <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-[#C5A059]'}`}></div>
               <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#1A1614]">
                 {order.status.replace(/_/g, " ")}
               </span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-[#1A1614]/5 pt-12">
          
          {/* Left Column: Items */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#1A1614]/5 pb-4">
                <h2 className="font-serif text-xl italic flex items-center gap-3">
                  <ShoppingBag size={18} className="text-[#C5A059]/60" />
                  Purchased Items
                </h2>
                <span className="text-[10px] tracking-widest text-[#3D352F]/40 uppercase">{order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}</span>
              </div>
              
              <div className="divide-y divide-[#1A1614]/5">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-8 py-8 first:pt-0 group">
                    <div className="w-24 h-32 bg-[#F5F1ED] overflow-hidden flex-shrink-0 relative border border-[#1A1614]/5">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl text-[#1A1614] hover:text-[#C5A059] transition-colors cursor-pointer leading-tight">{item.product.name}</h3>
                        <p className="text-[10px] tracking-[0.2em] text-[#3D352F]/50 uppercase">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-baseline pt-4">
                        <span className="text-[10px] tracking-wider text-[#3D352F]/30 uppercase">Unit: {currency}{item.price}</span>
                        <span className="font-serif text-2xl text-[#1A1614]">{currency}{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-10 bg-white border border-[#1A1614]/5">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 text-[#3D352F]/40">
                    <CreditCard size={18} />
                    <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Total Investment</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-5xl text-[#1A1614]">{currency}{order.total}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Information Sidebar */}
          <div className="lg:col-span-5 space-y-16">
            
            {/* Shipping Info */}
            <section className="space-y-8 bg-white/50 p-8 border border-[#1A1614]/5">
              <h3 className="text-[10px] tracking-[0.4em] text-[#C5A059] uppercase font-bold border-b border-[#C5A059]/10 pb-4 flex items-center gap-3">
                <MapPin size={14} /> Shipping Destination
              </h3>
              <div className="space-y-6 text-sm leading-relaxed text-[#3D352F]">
                <div>
                  <p className="text-[9px] tracking-[0.2em] text-[#3D352F]/40 uppercase mb-1">Recipient</p>
                  <p className="font-serif text-lg text-[#1A1614]">{order.address.name}</p>
                </div>
                <div className="space-y-1 font-light opacity-80 italic">
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state}</p>
                </div>
                <div className="pt-4 border-t border-[#1A1614]/5 flex items-center gap-3 text-[11px] tracking-widest uppercase opacity-60">
                   <Truck size={14} className="text-[#C5A059]" />
                   <span>{order.address.phone}</span>
                </div>
              </div>
            </section>

            {/* Verification Protocol */}
            <section className="bg-white p-10 border border-[#1A1614]/5 shadow-sm space-y-8">
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-[#C5A059]" />
                    <h3 className="font-serif text-xl italic">Verification Protocol</h3>
                 </div>
                 <p className="text-[9px] tracking-[0.2em] text-[#3D352F]/40 uppercase">Maison Quality Assurance</p>
               </div>
               
               {isReturnEligible() ? (
                 <div className="space-y-6">
                    <p className="text-[11px] leading-relaxed text-[#3D352F]/70 uppercase tracking-widest font-light">
                      The sequence is currently within the 48-hour inspection window. If artifacts are damaged, you may initiate a review.
                    </p>
                    <button
                      onClick={() => router.push(`/return/${order.id}`)}
                      className="w-full py-5 bg-[#1A1614] text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#C5A059] transition-all duration-500 shadow-md hover:shadow-lg"
                    >
                      Request Return
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 border border-[#1A1614]/5 bg-[#FDFCFB]">
                       <AlertCircle size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                       <p className="text-[10px] tracking-widest text-[#1A1614]/60 uppercase font-bold leading-relaxed">
                         {order.returnRequest 
                           ? "A verification request has already been logged." 
                           : "The 48-hour verification window has concluded or order is in transit."}
                       </p>
                    </div>
                    <p className="text-[9px] tracking-[0.3em] text-[#3D352F]/30 uppercase text-center italic font-light">
                      Refer to the Maison Policy for further details on quality standards.
                    </p>
                 </div>
               )}
            </section>
          </div>
        </div>

        {/* Footer Signature */}
        
      </div>
    </div>
  )
}
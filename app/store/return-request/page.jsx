
'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { 
  ShieldCheck, 
  Video, 
  Camera, 
  User, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare
} from "lucide-react"

export default function StoreReturnRequestsPage() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState({})
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const { data } = await axios.get("/api/store/return-request")
        setReturns(data.returns)
      } catch (err) {
        toast.error("Failed to retrieve archive.")
      } finally {
        setLoading(false)
      }
    }
    fetchReturns()
  }, [])

  const handleAction = async (id, status) => {
    const note = adminNotes[id] || ""
    if (status === "REJECTED" && !note.trim()) {
      return toast.error("Administrative note required for rejection.")
    }

    const toastId = toast.loading(status === "APPROVED" ? "Validating sequence..." : "Rejecting sequence...")
    setActionLoading(prev => ({ ...prev, [id]: true }))

    try {
      await axios.patch(`/api/store/return-request/${id}`, { status, adminNote: note })
      toast.success(`Request ${status.toLowerCase()}`, { id: toastId })
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status, adminNote: note } : r))
      setAdminNotes(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    } catch (err) {
      toast.error("Process failure", { id: toastId })
    } finally {
      setActionLoading(prev => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.6em] uppercase text-[#C5A059]">Syncing Archive</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1614] pt-32 pb-40 px-6 sm:px-12 font-light selection:bg-[#C5A059]/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-20 space-y-6 border-b border-[#1A1614]/5 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.5em] text-[#C5A059] uppercase font-bold">Admin Console</span>
            <div className="w-8 h-[1px] bg-[#C5A059]/30"></div>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight">
            Return <span className="italic">Sequences</span>
          </h1>
          <p className="text-[11px] tracking-widest text-[#3D352F]/40 uppercase max-w-xl">
            Reviewing client-initiated quality verification requests based on the 48-Hour Maison Protocol.
          </p>
        </header>

        {returns.length === 0 ? (
          <div className="p-20 text-center bg-white border border-[#1A1614]/5">
            <ShieldCheck className="mx-auto text-[#C5A059] opacity-20 mb-6" size={48} />
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#3D352F]/40">No pending verification sequences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {returns.map(req => {
              const isProcessing = actionLoading[req.id]
              return (
                <div key={req.id} className="group bg-white border border-[#1A1614]/5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700 hover:border-[#C5A059]/30">
                  <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#1A1614]/5">
                    
                    {/* Identification Details */}
                    <div className="lg:w-1/3 p-10 space-y-8 bg-[#FDFCFB]">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#C5A059]">
                          <Package size={16} />
                          <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Order Archive</span>
                        </div>
                        <p className="font-serif text-2xl tracking-tight italic">#{req.orderId.toUpperCase()}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#3D352F]/40">
                          <User size={16} />
                          <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Client Identity</span>
                        </div>
                        <p className="text-sm font-medium opacity-80">{req.user.email}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#3D352F]/40">
                          <Clock size={16} />
                          <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Sequence Status</span>
                        </div>
                        <div className={`inline-block px-4 py-1.5 text-[10px] tracking-widest font-bold uppercase ${
                          req.status === 'PENDING' ? 'bg-[#F5F1ED] text-[#C5A059]' : 
                          req.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' : 
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {req.status}
                        </div>
                      </div>
                    </div>

                    {/* Evidence & Logic */}
                    <div className="lg:w-2/3 p-10 space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#3D352F]/40 border-b border-[#1A1614]/5 pb-4">
                          <AlertCircle size={16} />
                          <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Stated Justification</span>
                        </div>
                        <p className="text-lg font-serif italic text-[#1A1614]/80 leading-relaxed">"{req.reason}"</p>
                      </div>

                      {/* Evidence Media */}
                      <div className="space-y-6">
                        <p className="text-[9px] tracking-[0.4em] text-[#3D352F]/40 uppercase font-bold">Artifact Proof Archive</p>
                        <div className="flex flex-wrap gap-4">
                          {req.images.map((img, i) => (
                            <a 
                              key={i} 
                              href={img} 
                              target="_blank" 
                              rel="noreferrer"
                              className="group/item relative px-5 py-3 border border-[#1A1614]/5 hover:border-[#C5A059] transition-all flex items-center gap-3 bg-[#FDFCFB]"
                            >
                              <Camera size={14} className="text-[#3D352F]/40 group-hover/item:text-[#C5A059]" />
                              <span className="text-[10px] tracking-widest uppercase text-[#3D352F]/60">Image_0{i+1}</span>
                              <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100" />
                            </a>
                          ))}
                          {req.video && (
                            <a 
                              href={req.video} 
                              target="_blank" 
                              rel="noreferrer"
                              className="group/item relative px-5 py-3 border border-[#C5A059]/20 hover:border-[#C5A059] transition-all flex items-center gap-3 bg-[#FDFCFB]"
                            >
                              <Video size={14} className="text-[#C5A059]" />
                              <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-bold">Unboxing Video</span>
                              <ExternalLink size={10} className="opacity-0 group-hover/item:opacity-100" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Administrative Actions */}
                      {req.status === "PENDING" ? (
                        <div className="pt-10 border-t border-[#1A1614]/5 space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#3D352F]/40">
                              <MessageSquare size={16} />
                              <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Administrative Communication</span>
                            </div>
                            <textarea
                              placeholder="Describe the decision logic for the client..."
                              value={adminNotes[req.id] || ""}
                              disabled={isProcessing}
                              onChange={e => setAdminNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                              className="w-full min-h-[120px] p-6 text-sm font-light bg-[#FDFCFB] border border-[#1A1614]/10 focus:border-[#C5A059] focus:outline-none transition-all placeholder:text-[#3D352F]/30"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              disabled={isProcessing}
                              onClick={() => handleAction(req.id, "APPROVED")}
                              className="flex-1 py-4 bg-[#1A1614] text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#C5A059] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                              <CheckCircle2 size={14} />
                              {isProcessing ? "Processing..." : "Approve Sequence"}
                            </button>
                            <button
                              disabled={isProcessing}
                              onClick={() => handleAction(req.id, "REJECTED")}
                              className="flex-1 py-4 border border-[#1A1614] text-[#1A1614] text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              {isProcessing ? "Processing..." : "Reject Sequence"}
                            </button>
                          </div>
                        </div>
                      ) : req.adminNote && (
                        <div className="pt-10 border-t border-[#1A1614]/5">
                           <div className="p-8 bg-[#FDFCFB] border border-[#1A1614]/5 space-y-4">
                              <p className="text-[9px] tracking-[0.4em] text-[#3D352F]/40 uppercase font-bold">Admin Directive</p>
                              <p className="text-sm leading-relaxed opacity-70 italic font-light">"{req.adminNote}"</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

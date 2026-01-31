
'use client'

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { 
  ArrowLeft, 
  Upload, 
  Video, 
  Camera, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Check
} from "lucide-react"

export default function ReturnPage() {
  const { orderId } = useParams()
  const router = useRouter()

  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!video) return toast.error("Maison Protocol requires an unboxing video.")
    if (images.length < 3) return toast.error("Maison Protocol requires at least 3 high-resolution images.")
    if (!reason.trim()) return toast.error("Please provide a detailed justification for the return.")

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("orderId", orderId)
      formData.append("video", video)
      images.forEach(img => formData.append("images", img))
      formData.append("reason", reason)

      await axios.post("/api/return", formData)

      toast.success("Return sequence initiated successfully.")
      router.push(`/orders/${orderId}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Sequence initiation failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1614] pt-32 pb-40 px-6 sm:px-12 font-light selection:bg-[#C5A059]/10">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <nav className="mb-16">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#3D352F]/60 hover:text-[#C5A059] transition-all"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Cancel Request</span>
          </button>
        </nav>

        {/* Header Section */}
        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.5em] text-[#C5A059] uppercase font-bold">Verification Request</span>
            <div className="w-8 h-[1px] bg-[#C5A059]/30"></div>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">
            Initiate Return <span className="italic">Sequence</span>
          </h1>
          <p className="text-[11px] tracking-widest text-[#3D352F]/50 uppercase max-w-xl leading-relaxed">
            In compliance with the 48-Hour Quality Assurance Protocol, please provide the mandatory artifacts for our review board.
          </p>
        </header>

        <div className="space-y-12">
          
          {/* Unboxing Video Upload */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1614]/5 pb-4">
              <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#1A1614]">01. Unboxing Media (Mandatory)</label>
              <Video size={14} className="text-[#C5A059]" />
            </div>
            
            <div className={`relative group border border-dashed transition-all duration-500 p-12 text-center flex flex-col items-center justify-center gap-4 ${video ? 'border-[#C5A059] bg-[#F5F1ED]/30' : 'border-[#1A1614]/10 hover:border-[#C5A059]/40 bg-white'}`}>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={e => setVideo(e.target.files[0])}
              />
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-4">
                {video ? (
                  <>
                    <div className="w-12 h-12 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-lg animate-in fade-in zoom-in">
                      <Check size={20} />
                    </div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-[#1A1614]">
                      {video.name.length > 30 ? video.name.slice(0, 30) + "..." : video.name}
                    </p>
                    <span className="text-[9px] text-[#3D352F]/40 uppercase tracking-wider">Click to re-upload</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 border border-[#1A1614]/5 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-700">
                      <Upload size={16} />
                    </div>
                    <p className="text-[10px] tracking-widest uppercase text-[#3D352F]/60">Upload Continuous Unboxing Video</p>
                    <span className="text-[9px] text-[#3D352F]/30 uppercase tracking-wider">No cuts or edits allowed</span>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Product Images Upload */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1614]/5 pb-4">
              <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#1A1614]">02. Static Evidence (Min. 3 Images)</label>
              <Camera size={14} className="text-[#C5A059]" />
            </div>
            
            <div className={`relative group border border-dashed transition-all duration-500 p-12 text-center flex flex-col items-center justify-center gap-4 ${images.length >= 3 ? 'border-[#C5A059] bg-[#F5F1ED]/30' : 'border-[#1A1614]/10 hover:border-[#C5A059]/40 bg-white'}`}>
              <input
                id="images-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => setImages([...e.target.files])}
              />
              <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center gap-4">
                {images.length > 0 ? (
                  <>
                    <div className="w-12 h-12 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-lg">
                      {images.length >= 3 ? <Check size={20} /> : <span className="font-bold text-xs">{images.length}</span>}
                    </div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-[#1A1614]">
                      {images.length} Evidence Artifacts Attached
                    </p>
                    {images.length < 3 && <span className="text-[9px] text-red-500 uppercase tracking-widest font-bold">Protocol requires {3 - images.length} more</span>}
                    <span className="text-[9px] text-[#3D352F]/40 uppercase tracking-wider">Click to replace archive</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 border border-[#1A1614]/5 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-700">
                      <Camera size={16} />
                    </div>
                    <p className="text-[10px] tracking-widest uppercase text-[#3D352F]/60">Upload Product & Packaging Proof</p>
                    <span className="text-[9px] text-[#3D352F]/30 uppercase tracking-wider">Clear, high-resolution photographs only</span>
                  </>
                )}
              </label>
            </div>
          </section>

          {/* Reason Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1614]/5 pb-4">
              <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#1A1614]">03. Justification Statement</label>
              <FileText size={14} className="text-[#C5A059]" />
            </div>
            <textarea
              placeholder="Describe the defect or damage in detail..."
              rows={5}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-white border border-[#1A1614]/5 p-6 text-sm font-light placeholder:text-[#3D352F]/20 focus:outline-none focus:border-[#C5A059]/40 transition-all shadow-sm"
            />
          </section>

          {/* Disclaimer */}
          <div className="flex items-start gap-4 p-6 bg-[#1A1614] text-[#FDFCFB] rounded-none">
             <ShieldCheck size={18} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
             <p className="text-[9px] tracking-[0.3em] uppercase font-medium leading-relaxed opacity-80">
               By submitting this sequence, you confirm that all artifacts provided are authentic and untampered. Fraudulent verification attempts result in a permanent suspension from the Maison.
             </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-[#C5A059] text-[#1A1614] text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-[#1A1614] hover:text-white transition-all duration-700 shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 border-2 border-[#1A1614]/20 border-t-[#1A1614] rounded-full animate-spin"></div>
                Processing Sequence...
              </span>
            ) : (
              "Initiate Verification Request"
            )}
          </button>
        </div>

        {/* Brand Footer Signature */}
        <footer className="mt-32 pt-12 border-t border-[#1A1614]/5 text-center space-y-4">
           <div className="w-8 h-[1px] bg-[#C5A059]/40 mx-auto"></div>
           <p className="text-[9px] tracking-[0.8em] text-[#3D352F]/20 uppercase font-medium">
             Frost Wayne Atelier Maison • All Rights Reserved
           </p>
        </footer>
      </div>
    </div>
  )
}
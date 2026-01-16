"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const EnhancedHeroSection = () => {
  const [currentMainSlide, setCurrentMainSlide] = useState(0)
  const [currentSecondarySlide, setCurrentSecondarySlide] = useState(0)

  const mainImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506629082632-34d2b61e3ed3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507895957656-f6f4ee22fc94?q=80&w=1000&auto=format&fit=crop",
  ]

  const secondaryImages = [
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552062407-291826de9c66?q=80&w=1000&auto=format&fit=crop",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainSlide((prev) => (prev + 1) % mainImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSecondarySlide((prev) => (prev + 1) % secondaryImages.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  }

  const slideUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content Side */}
        <motion.div
          className="lg:col-span-5 z-10 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-4" variants={itemVariants}>
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-[#9a8978] font-bold">Exclusive Collection</h2>
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-[#3d2b1f] leading-none tracking-tighter">
              Frost &<br />
              <span className="italic font-light text-[#6b5d52] block mt-2">Wayne</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-sm md:text-base max-w-sm text-[#3d2b1f]/70 font-light leading-relaxed"
            variants={itemVariants}
          >
            Experience the intersection of architectural precision and organic comfort. Our Spring collection defines
            the modern silhouette with unparalleled grace.
          </motion.p>

          <motion.div className="flex items-center gap-10 pt-4" variants={itemVariants}>
            <button className="px-10 py-4 bg-[#3d2b1f] hover:bg-[#1a120b] text-[#fdfbf7] font-bold text-[10px] tracking-[0.3em] uppercase transition-all duration-300 shadow-lg hover:translate-y-[-2px]">
              Explore Collection
            </button>
            <button className="group flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-bold text-[#3d2b1f] hover:text-[#9a8978] transition-colors">
              View Film
              <span className="w-12 h-px bg-[#3d2b1f]/30 group-hover:bg-[#9a8978] transition-all duration-500 group-hover:w-16"></span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Image Composition Side */}
        <div className="lg:col-span-7 relative h-[600px] md:h-[800px] flex items-center justify-center">
          {/* Main Tall Image Carousel */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[85%] overflow-hidden shadow-2xl border-[0.6mm] border-white group"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
          >
            {mainImages.map((image, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentMainSlide ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Collection ${index + 1}`}
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 hover:scale-105"
                />
              </motion.div>
            ))}

            {/* Navigation buttons for main carousel */}
            <button
              onClick={() => setCurrentMainSlide((prev) => (prev - 1 + mainImages.length) % mainImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronLeft size={20} className="text-[#3d2b1f]" />
            </button>
            <button
              onClick={() => setCurrentMainSlide((prev) => (prev + 1) % mainImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronRight size={20} className="text-[#3d2b1f]" />
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {mainImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMainSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentMainSlide ? "bg-white w-8 h-2" : "bg-white/50 w-2 h-2 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Overlapping Secondary Card with Carousel */}
          <motion.div
            className="absolute left-0 bottom-12 md:bottom-24 w-64 md:w-80 bg-white p-3 shadow-2xl z-20 group/card"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative aspect-square overflow-hidden mb-4">
              {secondaryImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 rounded-full overflow-hidden border-8 border-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentSecondarySlide ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Edit ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                  />
                </motion.div>
              ))}

              {/* Navigation buttons for circular carousel */}
              <button
                onClick={() =>
                  setCurrentSecondarySlide((prev) => (prev - 1 + secondaryImages.length) % secondaryImages.length)
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[#3d2b1f]/70 hover:bg-[#3d2b1f] p-1.5 rounded-full shadow-lg"
              >
                <ChevronLeft size={16} className="text-white" />
              </button>
              <button
                onClick={() => setCurrentSecondarySlide((prev) => (prev + 1) % secondaryImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[#3d2b1f]/70 hover:bg-[#3d2b1f] p-1.5 rounded-full shadow-lg"
              >
                <ChevronRight size={16} className="text-white" />
              </button>
            </div>

            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#9a8978]">
                Edit {currentSecondarySlide + 1}/{secondaryImages.length}
              </span>
              <svg
                className="w-4 h-4 text-[#3d2b1f] animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </motion.div>

          {/* Background Decorative Elements */}
          <motion.div
            className="absolute -right-8 top-12 w-24 h-px bg-[#9a8978] rotate-90 opacity-40"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.4, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="text-[10px] tracking-[0.8em] uppercase text-[#3d2b1f]/20 vertical-rl h-40 absolute top-0 right-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            Heritage • 2026
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedHeroSection

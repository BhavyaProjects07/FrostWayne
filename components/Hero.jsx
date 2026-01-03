"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const Hero = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  const luxuryBgImages = [
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2000&auto=format&fit=crop", // Luxury yacht
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop", // Penthouse view
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop", // Private jet
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop", // Luxury interior
    "https://plus.unsplash.com/premium_photo-1664202526828-6f18286508d2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Luxury lifestyle
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % luxuryBgImages.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        {luxuryBgImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentBgIndex ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Luxury background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* LEFT GRADIENT OVERLAY */}
        <div
          className="absolute inset-0 bg-gradient-to-r 
        from-[rgb(253,251,247)]/95
    via-[rgba(255, 255, 255, 0.31)]/70
    to-transparent

"
        ></div>
      </div>``

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content Side */}
        <motion.div
          className="lg:col-span-5 z-10 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-4" variants={itemVariants}>
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-[#bfa06b] font-bold">New Season Arrivals</h2>
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-[#3d2b1f] leading-none tracking-tighter">
              Frost &<br />
              <span className="italic font-light text-[#8b5e3c] block mt-2">Wayne</span>
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
            <button className="group flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-bold text-[#3d2b1f] hover:text-[#bfa06b] transition-colors">
              View Film
              <span className="w-12 h-px bg-[#3d2b1f]/30 group-hover:bg-[#bfa06b] transition-all duration-500 group-hover:w-16"></span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Image Composition Side */}
        <div className="lg:col-span-7 relative h-[600px] md:h-[800px] flex items-center justify-center">
          {/* Main Tall Image */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-[85%] overflow-hidden shadow-2xl border-[2.8mm] border-white"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop"
              alt="Main Collection Model"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 hover:scale-105"
            />
          </motion.div>

          {/* Overlapping Secondary Card */}
          <motion.div
            className="absolute left-0 bottom-12 md:bottom-24 w-64 md:w-80 bg-white p-3 shadow-2xl z-20"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative aspect-square overflow-hidden mb-4">
              {/* Circular Cutout Effect */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden border-8 border-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop"
                  alt="Menswear Edit"
                  className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                />
              </motion.div>
            </div>
            <div className="flex justify-between items-center px-2 py-1">
              <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#bfa06b]">Menswear Edit</span>
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
            className="absolute -right-8 top-12 w-24 h-px bg-[#bfa06b] rotate-90 opacity-40"
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

export default Hero

import React from 'react'
import Title from './Title'
import { motion } from 'framer-motion'

const Newsletter = () => {
    return (
        <section className="py-48 bg-[#F5F1E9] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-[3/4] bg-white p-3 shadow-2xl overflow-hidden">
                <motion.img 
                  whileInView={{ scale: 1.1 }}
                  transition={{ duration: 5 }}
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop" 
                  alt="Crafting Legacy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-16 -left-12 w-80 h-80 bg-[#8D6E63] p-12 hidden xl:flex flex-col justify-end text-white shadow-2xl">
                <p className="text-5xl font-serif mb-3 italic leading-none">Timeless.</p>
                <p className="text-[10px] tracking-[0.4em] font-bold uppercase opacity-80">Heritage Workshop</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              <h2 className="font-serif text-5xl md:text-8xl text-[#4A3728] mb-12 leading-[1.1]">
                Excellence <br/>In Every <br/><span className="italic">Stitch.</span>
              </h2>
              <p className="text-[#8D6E63] text-xl font-light leading-relaxed mb-14 italic max-w-lg">
                "We define the silhouette of success. Our creations are not merely owned; they are inherited."
              </p>
              <div className="space-y-8 text-sm text-[#4A3728]/70 font-light max-w-sm tracking-wide">
                <p>From the rare vicuña wools of our overcoats to the aerospace-grade titanium in our acoustics, every material is a testament to immortality.</p>
                <div className="pt-6">
                  <button className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#4A3728] group flex items-center gap-4">
                    Explore Our Legacy
                    <div className="w-12 h-[1px] bg-[#4A3728] group-hover:w-20 transition-all duration-500"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
    )
}

export default Newsletter
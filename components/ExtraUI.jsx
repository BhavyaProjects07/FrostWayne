
import React from 'react';
import { motion } from 'framer-motion';

const LOOKS = [
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000",
];

const Lookbook = () => {
  return (
    <section className="py-32 bg-[#2D241E] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h3 className="text-[#A67C52] text-xs uppercase tracking-[0.5em] mb-4">Autumn / Winter</h3>
          <h2 className="text-5xl md:text-6xl font-serif font-light italic">The Horizon Series</h2>
        </div>
        <p className="text-[#FDFBF7]/50 max-w-sm text-sm font-light">
          Captured in the high deserts of Utah, where the architecture of nature meets the geometry of fashion.
        </p>
      </div>

      <div className="overflow-x-auto hide-scrollbar flex gap-8 px-6 pb-12 cursor-grab active:cursor-grabbing">
        {LOOKS.map((look, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[80vw] md:w-[400px] group relative"
          >
            <div className="aspect-[2/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <img src={look} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={`Look ${i}`} />
            </div>
            <div className="absolute top-4 left-4 mix-blend-difference text-white text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Archival Look 0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Lookbook;
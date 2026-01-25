
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-[#1a1512] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[#FDFBF7] text-4xl md:text-6xl font-serif tracking-[0.5em] font-light"
            >
              FROST WAYNE
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="h-px bg-[#A67C52] mt-4"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
            className="text-[#A67C52] text-[10px] uppercase tracking-[0.8em] mt-12 font-bold"
          >
            Defining Silence
          </motion.p>
          
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 overflow-hidden h-4">
             {["2024", "AW", "ARCHIVE", "VOID"].map((text, i) => (
               <motion.span
                 key={i}
                 initial={{ y: 20 }}
                 animate={{ y: 0 }}
                 transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
                 className="text-[#FDFBF7]/20 text-[10px] uppercase tracking-widest"
               >
                 {text}
               </motion.span>
             ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="
            fixed inset-0 z-[100]
            bg-[#1a1512]
            flex items-center justify-center
            px-6
            overflow-hidden
          "
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Center wrapper */}
          <div className="flex flex-col items-center text-center w-full max-w-[420px]">
            {/* Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="
                text-[#FDFBF7]
                font-serif font-light
                tracking-[0.35em]
                text-3xl
                sm:text-4xl
                md:text-6xl
                whitespace-nowrap
              "
            >
              FROST WAYNE
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="h-px bg-[#A67C52] mt-4"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                times: [0, 0.5, 1],
              }}
              className="
                text-[#A67C52]
                text-[9px]
                sm:text-[10px]
                uppercase
                tracking-[0.6em]
                mt-10
                font-bold
              "
            >
              Defining Silence
            </motion.p>

            {/* Footer labels */}
            <div className="mt-14 flex gap-4 overflow-hidden h-4">
              {["2024", "AW", "ARCHIVE", "VOID"].map((text, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="
                    text-[#FDFBF7]/25
                    text-[9px]
                    uppercase
                    tracking-widest
                    whitespace-nowrap
                  "
                >
                  {text}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

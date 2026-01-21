'use client';
import React, { useState, useEffect } from 'react';
import { SLIDES } from '../constants.js';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A1614] flex flex-col justify-center">
      {/* Background Cinematic Engine */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${
            index === currentSlide ? 'opacity-25 scale-105 z-10' : 'opacity-0 scale-100 z-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(95, 84, 80, 0.59), rgba(59, 51, 46, 0.17), rgba(84, 70, 63, 0.49)), url(${slide.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Decorative Texture Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-soft-light opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#1A1614] via-transparent to-[#1A1614]"></div>

      {/* Side Density Elements */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col space-y-40">
        <div className="rotate-[-90deg] origin-left text-[9px] tracking-[1.2em] text-[#C5A059]/30 font-light whitespace-nowrap uppercase">
          Founder - Bhavya Sharma & Ayush Kumar
        </div>
        <div className="rotate-[-90deg] origin-left text-[9px] tracking-[1.2em] text-[#C5A059]/30 font-light whitespace-nowrap uppercase">
          ARCHIVE 00{currentSlide + 1} // FW25
        </div>
      </div>

      {/* Main Narrative Content */}
      <div className="relative z-30 container mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        {/* Animated Subtitle */}
        <div className="flex items-center space-x-6 mb-10 overflow-hidden">
          <span className="w-12 h-[1px] bg-[#C5A059]/40"></span>
          <p className={`text-[#C5A059] text-[10px] md:text-[11px] uppercase tracking-[1em] transition-all duration-1000 transform ${
            isAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {SLIDES[currentSlide].subtitle}
          </p>
          <span className="w-12 h-[1px] bg-[#C5A059]/40"></span>
        </div>

        {/* Cinematic Title Reveal */}
        <div className="relative mb-14 h-[5rem] md:h-[8rem] lg:h-[12rem] flex items-center">
          <h1 className="font-serif text-6xl md:text-9xl lg:text-[11rem] tracking-tighter leading-none text-[#E8DED1] flex flex-wrap justify-center overflow-hidden">
            {SLIDES[currentSlide].title.split("").map((char, i) => (
              <span 
                key={i} 
                className={`inline-block transition-all duration-[1200ms] ease-out transform ${
                  isAnimating ? 'translate-y-full' : 'translate-y-0'
                }`}
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#C5A059]/5 blur-[120px] -z-10 rounded-full"></div>
        </div>

        {/* God-level Buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-10 sm:space-y-0 sm:space-x-16">
          <a href='/shop'>
          <button className="group relative px-14 py-6 border border-[#C5A059]/20 text-[#E8DED1] text-[10px] uppercase tracking-[0.5em] font-medium overflow-hidden transition-all duration-700 hover:border-[#C5A059]">
            <span className="relative z-10">Experience the Maison</span>
            <div className="absolute inset-0 bg-[#C5A059] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[800ms] ease-out"></div>
            <div className="absolute inset-0 group-hover:bg-[#1A1614] mix-blend-difference transition-all duration-700"></div>
          </button>

          </a>
          
          <button className="group flex flex-col items-center space-y-4">
             <div className="flex items-center space-x-4 text-[#D4C4B5] group-hover:text-white transition-all">
                <span className="text-[10px] uppercase tracking-[0.4em]">Lookbook</span>
                <div className="w-10 h-10 rounded-full border border-[#C5A059]/20 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all duration-700">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#C5A059] group-hover:text-[#1A1614] transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
             </div>
             <div className="w-0 h-[1px] bg-[#C5A059] group-hover:w-full transition-all duration-700"></div>
          </button>
        </div>
      </div>

      {/* Bottom Interface HUD */}
      <div className="absolute bottom-16 w-full px-12 md:px-24 z-30 flex justify-between items-end">
        <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
               <span className="text-[8px] uppercase tracking-[0.4em] text-[#C5A059]/60">Navigation</span>
               <div className="w-8 h-[1px] bg-[#C5A059]/20"></div>
            </div>
            <div className="flex items-center space-x-8">
                {SLIDES.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => !isAnimating && setCurrentSlide(idx)}
                        className="group relative h-16 flex flex-col justify-end overflow-hidden"
                    >
                        <span className={`text-[10px] mb-3 transition-all duration-500 font-serif ${idx === currentSlide ? 'text-[#C5A059]' : 'text-[#D4C4B5]/30 group-hover:text-[#D4C4B5]'}`}>
                            0{idx + 1}
                        </span>
                        <div className={`w-[1px] transition-all duration-1000 ${idx === currentSlide ? 'h-10 bg-[#C5A059]' : 'h-4 bg-[#C5A059]/10 group-hover:h-8'}`}></div>
                    </button>
                ))}
            </div>
        </div>

        {/* Scroll Signature */}
        <div className="hidden lg:flex flex-col items-end group cursor-pointer">
             <div className="flex items-center space-x-6 mb-4">
                <span className="text-[9px] tracking-[0.5em] text-[#D4C4B5]/40 group-hover:text-[#C5A059] transition-all">SWIPE TO UNFOLD</span>
                <div className="w-16 h-[1px] bg-[#C5A059]/20 group-hover:w-24 transition-all"></div>
             </div>
             <div className="w-[1px] h-16 bg-[#C5A059]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059] to-transparent animate-hud-line"></div>
             </div>
        </div>
      </div>

      <style>{`
        @keyframes hud-line {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-hud-line {
          animation: hud-line 3s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};


export default Hero;

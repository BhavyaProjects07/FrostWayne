
'use client'
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Compass, Fingerprint, ArrowDown, ExternalLink } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="bg-[#1A1614] text-[#F7F3F0] overflow-hidden">
      {/* Cinematic Header Section */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Animated Background Text */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <h2 className="text-[25vw] font-serif leading-none select-none">MAISON</h2>
        </div>

        <div className="relative z-10 space-y-8 max-w-5xl">
          <div className="flex justify-center items-center space-x-6 opacity-60">
            <div className="w-12 h-[1px] bg-[#C5A059]"></div>
            <span className="text-[10px] tracking-[0.8em] uppercase font-bold text-[#C5A059]">The Genesis</span>
            <div className="w-12 h-[1px] bg-[#C5A059]"></div>
          </div>

          <h1 className={`font-serif text-6xl md:text-9xl tracking-tighter leading-[0.9] transition-all duration-[2s] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            Beyond the <br/>
            <span className="italic text-[#C5A059]">Threads.</span>
          </h1>

          <p className={`text-[#D4C4B5] text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto transition-all duration-[2s] delay-500 ${isVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Frost Wayne is a dialogue between architectural geometry and the human silhouette. We don't just dress bodies; we frame presence.
          </p>
        </div>

        <div className="absolute bottom-12 animate-bounce opacity-40">
          <ArrowDown size={20} className="text-[#C5A059]" />
        </div>
      </div>

      {/* The Founders: Architectural Profiles */}
      <div className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-[#C5A059]/10 pb-12">
          <div className="space-y-4">
            <span className="text-[9px] tracking-[0.5em] text-[#C5A059] uppercase font-bold">Atelier Heads</span>
            <h2 className="font-serif text-5xl md:text-7xl">The Visionaries</h2>
          </div>
          <div className="mt-8 md:mt-0 max-w-xs text-right text-[10px] tracking-widest leading-loose text-[#D4C4B5]/50 uppercase">
            ESTABLISHED IN 2024 TO REVOLUTIONIZE THE LUXURY DIGITAL LANDSCAPE THROUGH PRECISION AND NARRATIVE.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-40">
          {/* Founder 1: Bhavya Sharma */}
          <div className="group space-y-10">
            <div className="relative aspect-[3/4] bg-[#2A2420] overflow-hidden border border-[#C5A059]/10 group-hover:border-[#C5A059]/40 transition-all duration-1000">
              {/* Image Placeholder */}
              <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-[2s] cubic-bezier(0.2, 1, 0.3, 1)"></div>
              
              {/* Architectural Overlays */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="w-4 h-4 border-t border-l border-[#C5A059]/60"></div>
                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059]/60 uppercase">System Architect</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059]/60 uppercase">Ref: BHV-001</span>
                  <div className="w-4 h-4 border-b border-r border-[#C5A059]/60"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <h3 className="font-serif text-4xl">Bhavya Sharma</h3>
                <div className="h-[1px] flex-1 bg-[#C5A059]/20"></div>
              </div>
              <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold">Lead Developer & Creative Architect</p>
              <p className="text-[#D4C4B5] font-light leading-relaxed tracking-wide">
                Bhavya defines the structural integrity of Frost Wayne. Every interaction is coded with the same precision as a tailored seam, ensuring the digital atelier feels as tactile as the fabric itself.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="p-3 border border-[#C5A059]/20 rounded-full hover:bg-[#C5A059] hover:text-[#1A1614] transition-all duration-500">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Founder 2: Ayush Kumar */}
          <div className="group space-y-10 md:mt-32">
            <div className="relative aspect-[3/4] bg-[#2A2420] overflow-hidden border border-[#C5A059]/10 group-hover:border-[#C5A059]/40 transition-all duration-1000">
              {/* Image Placeholder */}
              <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-[2s] cubic-bezier(0.2, 1, 0.3, 1)"></div>
              
              {/* Architectural Overlays */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="w-4 h-4 border-t border-l border-[#C5A059]/60"></div>
                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059]/60 uppercase">Narrative Director</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059]/60 uppercase">Ref: AYU-002</span>
                  <div className="w-4 h-4 border-b border-r border-[#C5A059]/60"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <h3 className="font-serif text-4xl">Ayush Kumar</h3>
                <div className="h-[1px] flex-1 bg-[#C5A059]/20"></div>
              </div>
              <p className="text-[#C5A059] text-[10px] tracking-[0.5em] uppercase font-bold">Digital Marketer & Brand Strategist</p>
              <p className="text-[#D4C4B5] font-light leading-relaxed tracking-wide">
                Ayush is the voice of the Maison. He crafts the digital echoes of our craft, ensuring the Frost Wayne story resonates across global borders, translating physical luxury into digital desire.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="p-3 border border-[#C5A059]/20 rounded-full hover:bg-[#C5A059] hover:text-[#1A1614] transition-all duration-500">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values / HUD Stats Section */}
      <div className="bg-[#211D1B] py-32 border-y border-[#C5A059]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <ShieldCheck className="text-[#C5A059]" size={32} />
            <h4 className="font-serif text-2xl uppercase tracking-widest">Integrity</h4>
            <p className="text-[11px] tracking-widest text-[#D4C4B5]/40 leading-loose uppercase">UNCOMPROMISING SELECTION OF MATERIALS AND HONEST CRAFTSMANSHIP IN EVERY ARCHIVE PIECE.</p>
          </div>
          <div className="space-y-6">
            <Compass className="text-[#C5A059]" size={32} />
            <h4 className="font-serif text-2xl uppercase tracking-widest">Curation</h4>
            <p className="text-[11px] tracking-widest text-[#D4C4B5]/40 leading-loose uppercase">EACH COLLECTION IS A HIGHLY CURATED NARRATIVE OF TEXTILE GEOMETRY AND MODERN UTILITY.</p>
          </div>
          <div className="space-y-6">
            <Fingerprint className="text-[#C5A059]" size={32} />
            <h4 className="font-serif text-2xl uppercase tracking-widest">Heritage</h4>
            <p className="text-[11px] tracking-widest text-[#D4C4B5]/40 leading-loose uppercase">A FUTURE-FORWARD MAISON BUILT ON THE TIMELESS TRADITIONS OF MILANESE PRECISION.</p>
          </div>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="py-40 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="font-serif text-5xl md:text-8xl italic text-[#C5A059]/80 leading-tight">
            "We build artifacts, <br/> not just apparel."
          </h2>
          <div className="w-16 h-[1px] bg-[#C5A059] mx-auto"></div>
          <p className="text-[9px] tracking-[0.8em] uppercase font-bold text-[#D4C4B5]/60">The Frost Wayne Creed</p>
        </div>
      </div>
    </section>
  );
};

export default About;
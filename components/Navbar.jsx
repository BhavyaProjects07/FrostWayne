'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8 hidden md:flex text-sm uppercase tracking-widest font-medium text-[#c4a484]">
          <a href="#" className="hover:text-[#A67C52] transition-colors">Collections</a>
          <a href="#" className="hover:text-[#A67C52] transition-colors">Philosophy</a>
        </div>

        <Link
  href="/"
  className="relative text-4xl font-semibold text-slate-700"
>
  <Image
    src={assets.logo}
    alt="Logo"
    className="w-36"
  />
</Link>

        <div className="flex items-center gap-6 text-[#c4a484]">
          <button className="hover:text-[#A67C52] transition-colors hidden md:block"><Search size={20} /></button>
          <button className="hover:text-[#A67C52] transition-colors"><ShoppingBag size={20} /></button>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
          <div className="hidden md:flex text-sm uppercase tracking-widest font-medium gap-8">
            <a href="#" className="hover:text-[#A67C52] transition-colors">Account</a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FDFBF7] z-50 flex flex-col p-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-12">
            <div className="text-2xl font-serif tracking-widest">FROST WAYNE</div>
            <button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
          </div>
          <div className="flex flex-col gap-8 text-4xl font-serif text-[#2D241E]">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Collections</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Philosophy</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Archives</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

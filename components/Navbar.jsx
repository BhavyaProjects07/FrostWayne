import React, { useState, useEffect } from "react"
import { NAV_LINKS } from "../constants"
import { assets } from "@/assets/assets"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {useUser , useClerk , UserButton , useAuth} from "@clerk/nextjs";
import { PackageIcon, Store } from "lucide-react";
import axios from "axios";


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

   const { getToken } = useAuth()

    const [isAdmin, setIsAdmin] = useState(false)
    const [isSeller, setIsSeller] = useState(false)


    const { user } = useUser()
    
    const {openSignIn} = useClerk()
    const router = useRouter();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    const [search, setSearch] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
        setIsVisible(true)
    }, [])

  
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 px-6 md:px-16 py-8 ${
        scrolled
          ? "bg-[#1A1614]/90 backdrop-blur-2xl py-5 border-b border-[#C5A059]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <Link
              href="/"
              className="nav-logo relative text-4xl font-semibold text-slate-700 hover:scale-105 transition-transform duration-300 hidden sm:block"
              >
              <Image src={assets.FrostWayne || "/placeholder.svg"} alt="Logo" className="w-29" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-12">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.4em] font-medium text-[#D4C4B5] hover:text-[#C5A059] transition-all duration-500 relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#C5A059] transition-all duration-500 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex-1 flex justify-end items-center space-x-8">
          <button className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-[#D4C4B5] hover:text-white transition-all">
            Search
          </button>
          <button className="text-[10px] uppercase tracking-[0.3em] font-bold border border-[#C5A059]/30 px-8 py-3 hover:bg-[#C5A059] hover:text-[#1A1614] transition-all duration-700 rounded-sm">
            Shop Now
          </button>
        </div>
      </div>
    </nav>
  )
}


export default Navbar;



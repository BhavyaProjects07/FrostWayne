'use client'
import Image from "next/image"
import { assets } from "@/assets/assets";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {useUser , useClerk , UserButton , useAuth} from "@clerk/nextjs";
import { PackageIcon, Store } from "lucide-react";
import axios from "axios";


const NavLink = ({ href, children, delay = 0 }) => {
    return (
        <a
            href={href}
            className="relative group text-[12px] font-bold tracking-[0.4em] uppercase text-[#4A372880] transition-all duration-500"
            style={{
                animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
                opacity: 0,
            }}
        >
            {children}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#C4A484] to-transparent group-hover:w-full transition-all duration-700 ease-out" />
            <span className="absolute inset-0 text-[#8D6E63] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {children}
            </span>
        </a>
    )
}

const Navbar = () => {

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
        setIsVisible(true)
    }, [])

    useEffect(() => {
  if (!user) return

  const fetchRoles = async () => {
    try {
      const token = await getToken()

      // Admin check
      try {
        await axios.get("/api/admin/is-admin", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsAdmin(true)
      } catch {
        setIsAdmin(false)
      }

      // Seller check
      const sellerRes = await axios.get("/api/store/is-seller", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setIsSeller(!!sellerRes.data?.isSeller)

    } catch (err) {
      console.error("Role check failed", err)
    }
  }

  fetchRoles()
}, [user])


    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(196, 164, 132, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(196, 164, 132, 0);
                    }
                }

                .nav-logo {
                    animation: slideInDown 0.8s ease-out;
                }

                .search-input-wrapper {
                    animation: fadeInUp 0.6s ease-out 0.2s forwards;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .search-input-wrapper:focus-within {
                    transform: scale(1.02);
                }

                .cart-badge {
                    animation: pulse-glow 2s infinite;
                }

                .nav-button {
                    position: relative;
                    overflow: hidden;
                }

                .nav-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    transition: left 0.5s ease;
                }

                .nav-button:hover::before {
                    left: 100%;
                }
            `}</style>

            <nav className="relative bg-[#F7F3F0]/40 shadow-sm shadow-gray-300/50 backdrop-blur-sm transition-all duration-500 sticky top-0 z-1000">
                <div className="mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all duration-500">

                        <Link
                        href="/"
                        className="nav-logo relative text-4xl font-semibold text-slate-700 hover:scale-105 transition-transform duration-300 hidden sm:block"
                        >
                        <Image src={assets.logo || "/placeholder.svg"} alt="Logo" className="w-29" />
                        </Link>


                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-12">
                            <NavLink href="/" delay={0}>Home</NavLink>
                            <NavLink href="/shop" delay={0.1}>Shop</NavLink>
                            <NavLink href="/about" delay={0.2}>About</NavLink>
                            

                            <form 
                                onSubmit={handleSearch} 
                                className="search-input-wrapper hidden xl:flex items-center w-xs text-sm gap-2 bg-[#d8cbc480] px-4 py-3 rounded-full hover:bg-[#d8cbc4a0] transition-all duration-300"
                            >
                                <Search size={18} className="text-[#4A372880] transition-transform duration-300 group-hover:rotate-90" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-[#4A372880] transition-colors duration-300" 
                                    type="text" 
                                    placeholder="Search products" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    required 
                                />
                            </form>

                            <Link 
                                href="/cart" 
                                className="relative flex items-center gap-2 text-[#4a3728] group transition-all duration-300 hover:scale-110"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out 0.4s forwards`,
                                    opacity: 0,
                                }}
                            >
                                <ShoppingCart size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                                <span className="group-hover:text-[#8D6E63] transition-colors duration-300">Cart</span>
                                <button className="cart-badge absolute -top-1 left-3 text-[8px] text-white bg-[#C4A484] size-3.5 rounded-full transition-all duration-300 hover:scale-125 hover:bg-[#654321]">
                                    {cartCount}
                                </button>
                            </Link>

                            {
                                !user ? (
                                    <button 
                                        onClick={openSignIn} 
                                        className="nav-button px-8 py-2 bg-[#C4A484] text-white rounded-full relative transition-all duration-500 hover:shadow-lg hover:shadow-[#C4A48466]"
                                        style={{
                                            animation: `fadeInUp 0.6s ease-out 0.5s forwards`,
                                            opacity: 0,
                                        }}
                                    >
                                        <span className="relative z-10">Login</span>
                                    </button>

                                    
                                        
                                ) : (
                                    <div style={{
                                        animation: `fadeInUp 0.6s ease-out 0.5s forwards`,
                                        opacity: 0,
                                    }}>
                                        <UserButton>
                                            <UserButton.MenuItems>

                                                <UserButton.Action
                                                labelIcon={<PackageIcon size={16} />}
                                                label="My Orders"
                                                onClick={() => router.push("/orders")}
                                                />

                                                {isSeller && (
                                                <UserButton.Action
                                                    labelIcon={<Store size={16} />}
                                                    label="Store Dashboard"
                                                    onClick={() => router.push("/store")}
                                                />
                                                )}

                                                {isAdmin && (
                                                <UserButton.Action
                                                    labelIcon={<PackageIcon size={16} />}
                                                    label="Admin Panel"
                                                    onClick={() => router.push("/admin")}
                                                />
                                                )}

                                            </UserButton.MenuItems>
                                        </UserButton>

                                    </div>      
                                )
                            }


                        </div>

                        {/* Mobile User Button  */}
                        {/* Mobile Nav */}
                        <div
                        className="sm:hidden flex items-center justify-between w-full"
                        style={{
                            animation: `fadeInUp 0.6s ease-out forwards`,
                            opacity: isVisible ? 1 : 0,
                        }}
                        >
                            
                        {/* Mobile Logo (LEFT) */}
                        <Link href="/" className="flex items-center">
                            <Image
                            src={assets.logo}
                            alt="FrostWayne"
                            width={70}
                            height={60}
                            priority
                            />
                        </Link>

                        {/* Mobile Actions (RIGHT) */}
                        <div className="flex items-center gap-3">
                            {/* Search Icon */}
                            <button
                            onClick={() => setMobileSearchOpen((prev) => !prev)}
                            className="p-2 rounded-full bg-[#d8cbc480] text-[#4A372880] hover:bg-[#d8cbc4a0] transition"
                            >
                            <Search size={16} />
                            </button>

                            {/* Shop Icon */}
                            <button
                            onClick={() => router.push('/shop')}
                            className="p-2 rounded-full bg-[#d8cbc480] text-[#4A372880] hover:bg-[#d8cbc4a0] transition"
                            >
                            <Store size={16} />
                            </button>

                            {/* Cart Icon */}
                            <button
                            onClick={() => router.push('/cart')}
                            className="relative p-2 rounded-full bg-[#d8cbc480] text-[#4A372880] hover:bg-[#d8cbc4a0] transition"
                            >
                            <ShoppingCart size={16} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-[#C4A484] size-4 rounded-full flex items-center justify-center">
                                {cartCount}
                                </span>
                            )}
                            </button>

                            {/* Auth */}
                            {
                            user ? (
                                <UserButton>
                                    <UserButton.MenuItems>

                                        <UserButton.Action
                                        labelIcon={<ShoppingCart size={16} />}
                                        label="Cart"
                                        onClick={() => router.push("/cart")}
                                        />

                                        <UserButton.Action
                                        labelIcon={<PackageIcon size={16} />}
                                        label="My Orders"
                                        onClick={() => router.push("/orders")}
                                        />

                                        {isSeller && (
                                        <UserButton.Action
                                            labelIcon={<Store size={16} />}
                                            label="Store Dashboard"
                                            onClick={() => router.push("/store")}
                                        />
                                        )}

                                        {isAdmin && (
                                        <UserButton.Action
                                            labelIcon={<PackageIcon size={16} />}
                                            label="Admin Panel"
                                            onClick={() => router.push("/admin")}
                                        />
                                        )}

                                    </UserButton.MenuItems>
                                </UserButton>

                            ) : (
                                <button
                                onClick={openSignIn}
                                className="nav-button px-4 py-1.5 bg-[#C4A484] text-sm text-white rounded-full transition-all duration-500 hover:shadow-lg hover:shadow-[#C4A48466]"
                                >
                                Login
                                </button>
                            )
                            }
                        </div>
                        </div>

                    </div>
                </div>

                            {/* ✅ ADD MOBILE SEARCH INPUT RIGHT HERE */}
{mobileSearchOpen && (
  <form
    onSubmit={handleSearch}
    className="sm:hidden px-6 pb-3 animate-[fadeInUp_0.4s_ease-out]"
  >
    <div className="flex items-center gap-2 bg-[#d8cbc480] px-4 py-3 rounded-full">
      <Search size={16} className="text-[#4A372880]" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products"
        className="w-full bg-transparent outline-none text-sm placeholder-[#4A372880]"
        autoFocus
        required
      />
    </div>
  </form>
)}
                <hr className="border-gray-300 transition-all duration-500" />
            </nav>
        </>
    )
}

export default Navbar
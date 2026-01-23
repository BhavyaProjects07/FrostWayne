'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true)
    const [coupon, setCoupon] = useState(null)
    const [showPopup, setShowPopup] = useState(false)

    // 1️⃣ Fetch REAL public coupon
    useEffect(() => {
        axios.get('/api/public/coupons')
            .then(res => {
                if (res.data?.length) {
                    setCoupon(res.data[0])
                }
            })
            .catch(err => {
                console.error('COUPON FETCH ERROR:', err)
            })
    }, []) // ✅ EMPTY ARRAY — NEVER CHANGE


    // 2️⃣ Auto close popup after 10s
    useEffect(() => {
        if (!showPopup) return

        const timer = setTimeout(() => {
            setShowPopup(false)
        }, 10000)

        return () => clearTimeout(timer)
    }, [showPopup]) // ✅ ALWAYS [showPopup]


    const handleClaim = () => {
        if (!coupon) return
        setShowPopup(true)
    }

    if (!isOpen || !coupon) return null

    return (
        <>
            {/* ===== Banner ===== */}
            <div className="w-full px-6 py-1 font-medium text-sm text-white text-center bg-gradient-to-r from-[#000000] via-[#765341] to-[#3D251E]">
                <div
                    className="
          max-w-7xl mx-auto
          px-4 py-2
          flex flex-col gap-2
          sm:flex-row sm:items-center sm:justify-between
        "
                >
                    {/* Coupon Description */}
                    <p className="text-sm sm:text-base text-[#C4A484] text-center sm:text-left">
                        {coupon.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Mobile Claim */}
                        <button
                            onClick={handleClaim}
                            type="button"
                            className="
              sm:hidden
              text-sm
              font-medium
              text-[#C4A484]
              underline underline-offset-4
            "
                        >
                            Claim Offer
                        </button>

                        {/* Desktop Claim */}
                        <button
                            onClick={handleClaim}
                            type="button"
                            className="
              hidden sm:inline-flex
              items-center justify-center
              px-6 py-2
              rounded-full
              bg-[#C4A484]
              text-black
              font-medium
              hover:bg-[#b8986f]
              transition
            "
                        >
                            Claim
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            type="button"
                            aria-label="Close banner"
                            className="p-2 text-white/80 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== Glass Popup ===== */}
            {showPopup && (
                <div
                    className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/50 backdrop-blur-sm
        "
                >
                    <div
                        className="
            bg-black/70 backdrop-blur-xl
            border border-white/10
            rounded-2xl
            px-8 py-6
            text-center
            text-[#C4A484]
            max-w-sm w-full
          "
                    >
                        <h3 className="text-xl font-serif tracking-wide">
                            {coupon.code}
                        </h3>

                        <p className="mt-2 text-sm opacity-80">
                            {coupon.description}
                        </p>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(coupon.code)
                                toast.success("Coupon copied")
                            }}
                            className="
              mt-4
              px-6 py-2
              rounded-full
              bg-[#C4A484]
              text-black
              font-medium
              hover:bg-[#b8986f]
              transition
            "
                        >
                            Copy Code
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
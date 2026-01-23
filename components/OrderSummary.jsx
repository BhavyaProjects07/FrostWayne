'use client'

import {
  PlusIcon,
  SquarePenIcon,
  XIcon,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddressModal from './AddressModal'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { fetchCart } from '@/lib/features/cart/cartSlice'

const OrderSummary = ({ totalPrice, items }) => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

  const router = useRouter()
  const dispatch = useDispatch()
  const addressList = useSelector(state => state.address.list)

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  /* ================= APPLY COUPON ================= */
  const handleCouponCode = async (e) => {
    e.preventDefault()
    setCouponError('')

    try {
      if (!user) {
        toast.error('Please login to apply coupon')
        return
      }

      const token = await getToken()

      const { data } = await axios.post(
        '/api/coupons',
        { code: couponCodeInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // 🔒 CLIENT-SIDE MIN ORDER VALIDATION
      if (data.coupon.minOrderValue > totalPrice) {
        setCoupon(null)
        const msg = `Minimum order ${currency}${data.coupon.minOrderValue} required`
        setCouponError(msg)
        toast.error(msg)
        return
      }

      setCoupon(data.coupon)
      toast.success('Coupon applied successfully')

    } catch (error) {
      const msg =
        error.response?.data?.message || 'Invalid or expired coupon'
      setCoupon(null)
      setCouponError(msg)
      toast.error(msg)
    }
  }

  /* ===== AUTO REMOVE COUPON IF CART VALUE DROPS ===== */
  useEffect(() => {
    if (!coupon) return

    if (totalPrice < coupon.minOrderValue) {
      setCoupon(null)
      const msg = `Coupon removed — minimum ${currency}${coupon.minOrderValue} required`
      setCouponError(msg)
      toast.error('Coupon removed (cart value too low)')
    }
  }, [totalPrice])

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    try {
      if (!user) {
        toast.error('Please login to place order')
        return
      }

      if (!selectedAddress) {
        toast.error('Please select an address')
        return
      }

      const token = await getToken()

      const orderData = {
        addressId: selectedAddress.id,
        paymentMethod,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          hasSize: item.hasSize || false,
          size: item.size || null,
        })),
      }


      if (coupon) {
        orderData.couponCode = coupon.code
      }

      const { data } = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (paymentMethod === 'STRIPE') {
        window.location.href = data.session.url
      } else {
        toast.success('Order placed successfully')
        router.push('/orders')
        dispatch(fetchCart({ getToken }))
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ================= UI ================= */
  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Payment Summary</h2>

      {/* PAYMENT METHOD */}
      <p className="text-slate-400 text-xs my-4">Payment Method</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          checked={paymentMethod === 'COD'}
          onChange={() => setPaymentMethod('COD')}
        />
        <label>COD</label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          checked={paymentMethod === 'STRIPE'}
          onChange={() => setPaymentMethod('STRIPE')}
        />
        <label>Stripe Payment</label>
      </div>

      {/* ADDRESS */}
      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Address</p>

        {selectedAddress ? (
          <div className="flex gap-2 items-center">
            <p>
              {selectedAddress.name}, {selectedAddress.city},{' '}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              size={18}
              className="cursor-pointer"
              onClick={() => setSelectedAddress(null)}
            />
          </div>
        ) : (
          <>
            {addressList.length > 0 && (
              <select
                className="border p-2 w-full my-3 rounded"
                onChange={(e) =>
                  setSelectedAddress(addressList[e.target.value])
                }
              >
                <option value="">Select Address</option>
                {addressList.map((a, i) => (
                  <option key={i} value={i}>
                    {a.name}, {a.city}
                  </option>
                ))}
              </select>
            )}
            <button
              className="flex items-center gap-1 text-slate-600"
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </>
        )}
      </div>

      {/* PRICE + COUPON */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div>
            <p>Subtotal</p>
            <p>Shipping</p>
            {coupon && <p>Coupon</p>}
          </div>
          <div className="text-right font-medium">
            <p>{currency}{totalPrice.toLocaleString()}</p>
            <p>Free</p>
            {coupon && (
              <p>
                -{currency}
                {(coupon.discount / 100 * totalPrice).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {!coupon ? (
          <>
            <form
              onSubmit={(e) =>
                toast.promise(handleCouponCode(e), {
                  loading: 'Checking coupon...',
                })
              }
              className="flex gap-3 mt-3"
            >
              <input
                value={couponCodeInput}
                onChange={(e) =>
                  setCouponCodeInput(e.target.value.toUpperCase())
                }
                placeholder="Coupon Code"
                className="border p-1.5 rounded w-full"
              />
              <button className="bg-slate-600 text-white px-3 rounded">
                Apply
              </button>
            </form>

            {couponError && (
              <p className="text-xs text-red-500 mt-2 text-center">
                {couponError}
              </p>
            )}
          </>
        ) : (
          <div className="flex justify-center gap-2 text-xs mt-2">
            <p className="font-semibold">{coupon.code}</p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              className="cursor-pointer hover:text-red-600"
              onClick={() => setCoupon(null)}
            />
          </div>
        )}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between py-4">
        <p>Total</p>
        <p className="font-medium">
          {currency}
          {coupon
            ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2)
            : totalPrice.toLocaleString()}
        </p>
      </div>

      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), {
            loading: 'Placing order...',
          })
        }
        className="w-full bg-slate-700 text-white py-2.5 rounded"
      >
        Place Order
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  )
}

export default OrderSummary

'use client'

import Image from "next/image"
import { useSelector } from "react-redux"
import Rating from "./Rating"
import { useState } from "react"
import RatingModal from "./RatingModal"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"


const OrderItem = ({ order, onCancelSuccess }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"
  const { ratings } = useSelector(state => state.rating)
  const router = useRouter()

  const [ratingModal, setRatingModal] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const { getToken } = useAuth()

  /* ---------------- CANCEL CONDITIONS ---------------- */
  const canCancel =
    order.status === "ORDER_PLACED" &&
    (
      order.paymentMethod === "COD" ||
      (order.paymentMethod === "RAZORPAY" && order.paymentStatus !== "PAID")
    )

  /* ---------------- CANCEL HANDLER ---------------- */
  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return

    try {
      setCancelLoading(true)
      const token = await getToken()

      await axios.post(
        "/api/orders/cancel",
        { orderId: order.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Order cancelled successfully", { duration: 4000 })

      // ✅ SAFE callback (prevents crash)
      if (typeof onCancelSuccess === "function") {
        onCancelSuccess(order.id)
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel order"
      )
    } finally {
      setCancelLoading(false)
    }
  }

  /* ---------------- STATUS BADGE ---------------- */
  const statusBadge = () => {
    switch (order.status) {
      case "CANCELLED":
        return "bg-red-100 text-red-600"
      case "DELIVERED":
        return "bg-green-100 text-green-600"
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-600"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <tr className="text-sm max-md:hidden">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 aspect-square bg-slate-100 rounded-md flex items-center justify-center">
                  <Image
                    src={item.product.images[0]}
                    alt="product"
                    width={60}
                    height={60}
                    className="h-14 w-auto"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="font-medium text-slate-700">
                    {item.product.name}
                  </p>
                  <p className="text-sm">
                    {currency}{item.price} × {item.quantity}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toDateString()}
                  </p>

                  {/* Rating */}
                  {order.status === "DELIVERED" && (
                    ratings.find(
                      r =>
                        r.orderId === order.id &&
                        r.productId === item.product.id
                    ) ? (
                      <Rating
                        value={
                          ratings.find(
                            r =>
                              r.orderId === order.id &&
                              r.productId === item.product.id
                          ).rating
                        }
                      />
                    ) : (
                      <button
                        onClick={() =>
                          setRatingModal({
                            orderId: order.id,
                            productId: item.product.id,
                          })
                        }
                        className="text-[#c4a484] text-sm hover:underline"
                      >
                        Rate Product
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
  onClick={() => router.push(`/orders/${order.id}`)}
  className="block text-xs text-blue-600 hover:underline"
>
  View Details
</button>

        </td>

        <td className="text-center">
          {currency}{order.total}
        </td>

        <td className="text-left">
          <p>{order.address.name}</p>
          <p>{order.address.street}</p>
          <p>{order.address.city}, {order.address.state}</p>
          <p>{order.address.phone}</p>
        </td>

        <td className="space-y-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${statusBadge()}`}
          >
            {order.status.replace(/_/g, " ").toLowerCase()}
          </span>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="block text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </td>
      </tr>

      {/* ================= MOBILE ================= */}
      {/* ================= MOBILE ================= */}
      {/* ================= MOBILE ================= */}
<tr className="md:hidden">
  <td colSpan={4} className="py-4">
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      {order.orderItems.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center">
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="flex-1 space-y-1">
            <p className="font-semibold text-sm">
              {item.product.name}
            </p>

            <p className="text-xs text-slate-500">
              {currency}{item.price} × {item.quantity}
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs capitalize ${statusBadge()}`}
            >
              {order.status.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between text-sm pt-2">
        <span>Total</span>
        <span className="font-semibold">
          {currency}{order.total}
        </span>
      </div>

      <button
        onClick={() => router.push(`/orders/${order.id}`)}
        className="w-full border border-black py-2 rounded text-sm"
      >
        View Details
      </button>

      {canCancel && (
        <button
          onClick={handleCancelOrder}
          disabled={cancelLoading}
          className="w-full text-sm text-red-600"
        >
          {cancelLoading ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  </td>
</tr>



      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          ratingModal={ratingModal}
          setRatingModal={setRatingModal}
        />
      )}

      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-200 my-6" />
        </td>
      </tr>
    </>
  )
}

export default OrderItem

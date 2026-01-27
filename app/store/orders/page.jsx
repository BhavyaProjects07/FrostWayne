"use client"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { orderDummyData } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import toast from "react-hot-toast"
import { set } from "date-fns"
import axios from "axios"

export default function StoreOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const {getToken} = useAuth()

  const fetchOrders = async () => {
    try {
      const token = await getToken()
      const {data}= await axios.get("/api/store/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(data.orders)

    } catch (error) {
      toast.error(error?.response?.data?.error || error.mesage)
    }

    finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {

    try {
      const token = await getToken()
      await axios.post("/api/store/orders",{orderId, status}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(
          prev => prev.map(order => order.id === orderId ? {...order, status} : order)
      )
    toast.success("Order status updated")
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    }
    
  }

  const openModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) return <Loading />

  return (
    <>
      <h1 className="text-2xl text-[#9a8978] mb-5">
        Store <span className="text-[#6b5d52] font-medium">Orders</span>
      </h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-[#ede6dd]">
          <table className="w-full text-sm text-left text-[#6b5d52]">
            <thead className="bg-[#f0e8e0] text-[#6b5d52] text-xs uppercase tracking-wider">
              <tr>
                {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((heading, i) => (
                  <th key={i} className="px-4 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede6dd]">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#fefdfb] transition-colors duration-150 cursor-pointer"
                  onClick={() => openModal(order)}
                >
                  <td className="pl-6 text-[#6b5d52]">{index + 1}</td>
                  <td className="px-4 py-3">{order.user?.name}</td>
                  <td className="px-4 py-3 font-medium text-[#6b5d52]">₹{order.total}</td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    {order.coupon?.code ? (
  <span className="bg-[#ede6dd] text-[#6b5d52] text-xs px-2 py-1 rounded-full">
    {order.coupon.code}
  </span>
) : (
  "—"
)}

                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={order.status === "CANCELLED"}
                      className="border rounded-md text-sm bg-white"
                    >
                      <option value="ORDER_PLACED">ORDER PLACED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_OF_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                  </td>
                  <td className="px-4 py-3 text-[#9a8978]">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black/50 text-[#6b5d52] text-sm backdrop-blur-xs z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fefdfb] rounded-lg shadow-lg max-w-2xl w-full p-6 relative border border-[#ede6dd]"
          >
            <h2 className="text-xl font-semibold text-[#6b5d52] mb-4 text-center">Order Details</h2>

            {/* Customer Details */}
            <div className="mb-4">
              <h3 className="font-semibold text-[#6b5d52] mb-2">Customer Details</h3>
              <p>
                <span className="text-[#6b5d52]">Name:</span> {selectedOrder.user?.name}
              </p>
              <p>
                <span className="text-[#6b5d52]">Email:</span> {selectedOrder.user?.email}
              </p>
              <p>
                <span className="text-[#6b5d52]">Phone:</span> {selectedOrder.address?.phone}
              </p>
              <p>
                <span className="text-[#6b5d52]">Address:</span>{" "}
                {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}
              </p>
            </div>

            {/* Products */}
            <div className="mb-4">
              <h3 className="font-semibold text-[#6b5d52] mb-2">Products</h3>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-[#ede6dd] shadow rounded p-2 bg-[#fefdfb]"
                  >
                    <img
                      src={item.product.images?.[0].src || item.product.images?.[0]}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-[#6b5d52]">{item.product?.name}</p>
                      <p className="text-[#9a8978]">Qty: {item.quantity}</p>
                      <p className="text-[#9a8978]">Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status */}
            <div className="mb-4 text-[#6b5d52]">
              <p>
                <span className="text-[#6b5d52]">Payment Method:</span> {selectedOrder.paymentMethod}
              </p>
              <p>
                <span className="text-[#6b5d52]">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}
              </p>
              {selectedOrder.coupon && (
  <p>
    Coupon: {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}% off)
  </p>
)}

              <p>
                <span className="text-[#6b5d52]">Status:</span> {selectedOrder.status}
              </p>
              <p>
                <span className="text-[#6b5d52]">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-[#ede6dd] rounded hover:bg-[#dcd2c8] text-[#6b5d52]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

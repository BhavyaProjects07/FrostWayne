"use client"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon } from "lucide-react"
import { couponDummyData } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"


export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])

  const { getToken } = useAuth()

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: new Date(),
  })

  const fetchCoupons = async () => {
    try {
      const token = await getToken()
      const {data} = await axios.get('/api/admin/coupon', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCoupons(data.coupons)
    } catch (error) {
       toast.error(error?.response?.data?.error || error.message || "Failed to fetch coupons")
    }
  }

  const handleAddCoupon = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      newCoupon.discount = Number(newCoupon.discount)
      newCoupon.expiresAt = new Date(newCoupon.expiresAt)
      const {data} = await axios.post('/api/admin/coupon', { coupon: newCoupon }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(data.message)
      await fetchCoupons()
    } catch (error) {
       toast.error(error?.response?.data?.error || error.message || "Failed to add coupon")
    }
  }

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
  }

  const deleteCoupon = async (code) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this coupon?")
      if (!confirm) return
      const token = await getToken()
      const {data} = await axios.delete(`/api/admin/coupon?code=${code}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(data.message)
      await fetchCoupons()
      toast.success("Coupon deleted successfully")
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || "Failed to delete coupon")
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <div className="text-[#9a8978] mb-40">
      {/* Add Coupon */}
      <form
        onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })}
        className="max-w-sm text-sm"
      >
        <h2 className="text-2xl">
          Add <span className="text-[#6b5d52] font-medium">Coupons</span>
        </h2>
        <div className="flex gap-2 max-sm:flex-col mt-2">
          <input
            type="text"
            placeholder="Coupon Code"
            className="w-full mt-2 p-2 border border-[#d4c4b3] outline-[#9a8978] rounded-md bg-white/60 focus:bg-white transition text-[#6b5d52]"
            name="code"
            value={newCoupon.code}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            placeholder="Coupon Discount (%)"
            min={1}
            max={100}
            className="w-full mt-2 p-2 border border-[#d4c4b3] outline-[#9a8978] rounded-md bg-white/60 focus:bg-white transition text-[#6b5d52]"
            name="discount"
            value={newCoupon.discount}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Coupon Description"
          className="w-full mt-2 p-2 border border-[#d4c4b3] outline-[#9a8978] rounded-md bg-white/60 focus:bg-white transition text-[#6b5d52]"
          name="description"
          value={newCoupon.description}
          onChange={handleChange}
          required
        />

        <label>
          <p className="mt-3 text-[#6b5d52]">Coupon Expiry Date</p>
          <input
            type="date"
            placeholder="Coupon Expires At"
            className="w-full mt-1 p-2 border border-[#d4c4b3] outline-[#9a8978] rounded-md bg-white/60 focus:bg-white transition text-[#6b5d52]"
            name="expiresAt"
            value={format(newCoupon.expiresAt, "yyyy-MM-dd")}
            onChange={handleChange}
          />
        </label>

        <div className="mt-5">
          <div className="flex gap-2 mt-3">
            <label className="relative inline-flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                className="sr-only peer"
                name="forNewUser"
                checked={newCoupon.forNewUser}
                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
              />
              <div className="w-11 h-6 bg-[#d4c4b3] rounded-full peer peer-checked:bg-[#6b5d52] transition-colors duration-200"></div>
              <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
            </label>
            <p className="text-[#6b5d52]">For New User</p>
          </div>
          <div className="flex gap-2 mt-3">
            <label className="relative inline-flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                className="sr-only peer"
                name="forMember"
                checked={newCoupon.forMember}
                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
              />
              <div className="w-11 h-6 bg-[#d4c4b3] rounded-full peer peer-checked:bg-[#6b5d52] transition-colors duration-200"></div>
              <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
            </label>
            <p className="text-[#6b5d52]">For Member</p>
          </div>
        </div>
        <button className="mt-4 p-2 px-10 rounded bg-[#6b5d52] text-white active:scale-95 transition hover:bg-[#5a4d44]">
          Add Coupon
        </button>
      </form>

      {/* List Coupons */}
      <div className="mt-14">
        <h2 className="text-2xl">
          List <span className="text-[#6b5d52] font-medium">Coupons</span>
        </h2>
        <div className="overflow-x-auto mt-4 rounded-lg border border-[#d4c4b3] max-w-4xl">
          <table className="min-w-full bg-white/70 backdrop-blur text-sm">
            <thead className="bg-[#ede6dd]">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">Code</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">Description</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">Discount</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">Expires At</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">New User</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">For Member</th>
                <th className="py-3 px-4 text-left font-semibold text-[#6b5d52]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4c4b3]">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-[#f5f1ed]">
                  <td className="py-3 px-4 font-medium text-[#6b5d52]">{coupon.code}</td>
                  <td className="py-3 px-4 text-[#6b5d52]">{coupon.description}</td>
                  <td className="py-3 px-4 text-[#6b5d52]">{coupon.discount}%</td>
                  <td className="py-3 px-4 text-[#6b5d52]">{format(coupon.expiresAt, "yyyy-MM-dd")}</td>
                  <td className="py-3 px-4 text-[#6b5d52]">{coupon.forNewUser ? "Yes" : "No"}</td>
                  <td className="py-3 px-4 text-[#6b5d52]">{coupon.forMember ? "Yes" : "No"}</td>
                  <td className="py-3 px-4 text-[#6b5d52]">
                    <DeleteIcon
                      onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting coupon..." })}
                      className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

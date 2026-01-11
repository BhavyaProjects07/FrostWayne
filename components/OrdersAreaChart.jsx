"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const OrdersAreaChart = ({ allOrders = [] }) => {
  // Ensure we always work with an array
  const safeOrders = Array.isArray(allOrders) ? allOrders : []

  // Group orders by date
  const ordersPerDay = safeOrders.reduce((acc, order) => {
    if (!order?.createdAt) return acc

    const date = new Date(order.createdAt)
      .toISOString()
      .split("T")[0] // YYYY-MM-DD

    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Convert object → array for Recharts
  const chartData = Object.keys(ordersPerDay).map((date) => ({
    date,
    orders: ordersPerDay[date],
  }))

  // Prevent rendering empty charts
  if (!chartData.length) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-slate-400">
        No orders data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#6b5d52"
          fill="#cbbfb4"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default OrdersAreaChart

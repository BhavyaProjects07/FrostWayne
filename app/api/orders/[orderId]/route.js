import prisma from "@/lib/prisma"

export async function GET(req, { params }) {
  // ✅ FIX: params is async
  const { orderId } = await params

  if (!orderId) {
    return Response.json(
      { message: "Order ID missing" },
      { status: 400 }
    )
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      address: true,
      returnRequest: true,
    },
  })

  if (!order) {
    return Response.json(
      { message: "Order not found" },
      { status: 404 }
    )
  }

  return Response.json({ order })
}

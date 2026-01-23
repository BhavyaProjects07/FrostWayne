import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isPublic: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1, // show latest public coupon
    })

    return NextResponse.json(coupons, { status: 200 })
  } catch (error) {
    console.error("PUBLIC COUPON ERROR:", error)
    return NextResponse.json([], { status: 200 })
  }
}

import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request) {
  const { userId } = getAuth(request)
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const store = await prisma.store.findUnique({
    where: { userId },
  })

  if (!store) {
    return NextResponse.json(
      { message: "Store not found" },
      { status: 404 }
    )
  }

  const returns = await prisma.returnRequest.findMany({
    where: {
      order: {
        storeId: store.id,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json({ returns })
}

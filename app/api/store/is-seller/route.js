import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import  authSeller  from "@/middlewares/authSeller";
// Auth seller


export async function GET(request) {
  try {
    const { userId } = getAuth(request)

    const storeInfo = await prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    })

    if (!storeInfo) {
      return NextResponse.json({
        isSeller: false,
      })
    }

    return NextResponse.json({
      isSeller: true,
      isActive: storeInfo.isActive,
      storeInfo,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

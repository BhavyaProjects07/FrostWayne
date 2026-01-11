import { inngest } from "@/inngest/client";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { cacheTag } from "next/cache";
import { NextResponse } from "next/server";

// add a new coupon

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({
            data: coupon
        }).
        then(async (coupon) => {
            // run inngest function to delete coupon after expiry date
            await inngest.send({
                name:"app/coupon.expired",
                data: {
                    code: coupon.code,
                    expiresAt: coupon.expiresAt,
                }
            })
        })

        return NextResponse.json({ message: "Coupon added successfully" }, { status: 201 })
    } catch (error) {
        console.error(error)
            return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}


// delete a coupon

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }
        const { searchParams } = request.nextUrl
        const code = searchParams.get("code")
        await prisma.coupon.delete({
            where: { code }
        })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }

}


// get all coupons
export async function GET(request) { 
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }

        const coupons = await prisma.coupon.findMany({

        })
        return NextResponse.json({ coupons }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
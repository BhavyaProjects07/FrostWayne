import {  getAuth} from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const { userId, has } = getAuth(request)
        const { code } = await request.json()
        
        const coupon = await prisma.coupon.findFirst({
            where: {
                code: code.toUpperCase(),
                expiresAt: {
                gt: new Date(),
                },
            },
        });


        if(!coupon) {
            return new Response(JSON.stringify({ message: "Invalid or expired coupon" }), { status: 404 });
        }


        if (coupon.forNewUsers) {
            const userOrders = await prisma.order.findMany({
                where: {
                    userId: userId
                }
            
            });

            if (userOrders.length > 0) {
                return new Response(JSON.stringify({ message: "Coupon valid only for new users" }), { status: 400 });
            }
        }

        

        return new Response(JSON.stringify({ coupon }), { status: 200 });

            
    } catch (error) {
        console.error("Error validating coupon:", error);
        return new Response(JSON.stringify({ error:error.code || error.message }), { status: 500 });
    }
}
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



// add new rating



export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, productId, rating, review } = await request.json();
        
        const order = await prisma.order.findUnique({
            where: { id: orderId,  userId },
        })

        if(!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }


        const isAlreadyRated = await prisma.rating.findFirst({
            where: { orderId, productId },
        })

        if(isAlreadyRated) {
            return NextResponse.json({ message: 'You have already rated this product for this order' }, { status: 400 });
        }

        const response = await prisma.rating.create({
            data: {
                userId,
                orderId,
                productId,
                rating,
                review
            }
        })

        return NextResponse.json({ message: 'Rating added successfully', rating: response }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 500 });
    }
}
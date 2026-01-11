// toggle stock of a product
import { getAuth } from "@clerk/nextjs/server"
import { authSeller} from "@/middlewares/authSeller"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function POST(request) {
    try {
        const { userID } = getAuth(request)
        const { productId } = await request.json()
        
        if (!productId) {
            return NextResponse.json({ error: "Missing Product details" }, { status: 400 });
        }

        const storeId = await authSeller(userID)


        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        // check if the product exist in the store

        const product = await prisma.product.findFirst({
            where : {
                id: productId,
                storeId
            }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                inStock : !product.inStock
            }
        })

        return NextResponse.json({ message: "Product stock status updated successfully" }, { status: 200 });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message || error.code }, { status: 500 });
    }
}
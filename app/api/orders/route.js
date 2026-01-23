import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";


export async function POST(request) {
    try {
        const { userId, has } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { addressId, items, couponCode, paymentMethod } = await request.json();
        
        if (!addressId || !items || items.length === 0 || !paymentMethod || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        let coupon = null;

        if (couponCode) {
            coupon = await prisma.coupon.findFirst({
                where: {
                    code: couponCode
                    
                }
            })
            if(!coupon) {
            return new Response(JSON.stringify({ message: "Invalid or expired coupon" }), { status: 404 });
        }
        }
        


        if (coupon && coupon.forNewUsers) {
            const userOrders = await prisma.order.findMany({
                where: {
                    userId: userId
                }
            
            });

            if (userOrders.length > 0) {
                return new Response(JSON.stringify({ message: "Coupon valid only for new users" }), { status: 400 });
            }
        }

        for (const item of items) {
            if (item.hasSize && !item.size) {
                return NextResponse.json(
                    { message: `Please select a size for ${item.name}` },
                    { status: 400 }
                )
            }
        }




        // group orders by storeId using a map

        const ordersByStore = new Map()
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: {
                    id: item.id
                }
            });
            const storeId = product.storeId;
            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, []);
            }
            ordersByStore.get(storeId).push({ ...item, price:product.price });
        }

        let orderIds = [];
        let fullAmount = 0;

        let isShippingFeeAdded = false;

        // create an order for each store
        for (const [storeId, sellerItems] of ordersByStore.entries()) {
            let total = sellerItems.reduce((acc,item) => 
                acc + (item.price * item.quantity), 0
            )

            if (couponCode) {
                total -= (total * coupon.discount) / 100;
            }

            if (!isShippingFeeAdded) {
                total += 5;
                isShippingFeeAdded = true;
            }

            fullAmount += parseFloat(total.toFixed(2));

            const order = await prisma.order.create({
                data: {
                    userId,
                    storeId,
                    addressId,
                    total: Number(total.toFixed(2)),
                    paymentMethod,
                    isCouponUsed: !!coupon,
                    coupon: coupon
                    ? {
                        id: coupon.id,
                        code: coupon.code,
                        discount: coupon.discount,
                        forNewUsers: coupon.forNewUsers,
                        }
                    : null,
                    orderItems: {
                    create: sellerItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        hasSize: item.hasSize,
                        size: item.size,
                    })),
                    },
                },
            });


            orderIds.push(order.id);
        }

        // clear the cart

        await prisma.user.update({
            where: { id: userId },
            data: { cart: {} }
        })

        return NextResponse.json({ message: "Order placed successfully", orderIds, fullAmount }, { status: 201 });

    

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 500 });
    }
}



// get all orders for a user

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const orders = await prisma.order.findMany({
            where: { userId, OR: [
                { paymentMethod: PaymentMethod.COD },
                { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] }
            ]
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ orders }, { status: 200 });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { sendBrevoEmail } from "@/lib/brevo";

/* ---------------- HELPERS ---------------- */

function buildOrderItemsBlock(orderItems) {
  return orderItems
    .map(
      (item) =>
        `• ${item.product.name}${
          item.size ? ` (Size: ${item.size})` : ""
        } × ${item.quantity} — ₹${(item.price * item.quantity).toFixed(2)}`
    )
    .join("<br/>");
}

/* ---------------- POST : CREATE ORDER ---------------- */

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { addressId, items, couponCode, paymentMethod } =
      await request.json();

    if (
      !addressId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    let coupon = null;

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: { code: couponCode },
      });

      if (!coupon) {
        return NextResponse.json(
          { message: "Invalid or expired coupon" },
          { status: 404 }
        );
      }
    }

    if (coupon?.forNewUsers) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
      });

      if (userOrders.length > 0) {
        return NextResponse.json(
          { message: "Coupon valid only for new users" },
          { status: 400 }
        );
      }
    }

    for (const item of items) {
      if (item.hasSize && !item.size) {
        return NextResponse.json(
          { message: `Please select a size for ${item.name}` },
          { status: 400 }
        );
      }
    }

    /* -------- GROUP ITEMS BY STORE -------- */

    const ordersByStore = new Map();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!ordersByStore.has(product.storeId)) {
        ordersByStore.set(product.storeId, []);
      }

      ordersByStore
        .get(product.storeId)
        .push({ ...item, price: product.price });
    }

    let orderIds = [];
    let fullAmount = 0;
    let subtotal = 0;
    let discountAmount = 0;
    let shippingFee = 5;
    let isShippingFeeAdded = false;

    /* -------- CREATE ORDERS -------- */

    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      subtotal += total;

      if (coupon) {
        const discount = (total * coupon.discount) / 100;
        discountAmount += discount;
        total -= discount;
      }

      if (!isShippingFeeAdded) {
        total += shippingFee;
        isShippingFeeAdded = true;
      }

      total = Number(total.toFixed(2));
      fullAmount += total;

      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          total,
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
            create: sellerItems.map((item) => ({
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

    /* -------- CLEAR CART -------- */

    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    });

    /* -------- FETCH DATA FOR EMAIL -------- */

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: { in: orderIds } },
      include: { product: true },
    });

    const orderItemsBlock = buildOrderItemsBlock(orderItems);
    const orderIdString = orderIds.join(", ");
    const orderDate = new Date().toLocaleString();

    const deliveryAddress = `
      ${address.name}<br/>
      ${address.street}, ${address.city}<br/>
      ${address.state}, India - ${address.pincode}<br/>
      Phone: ${address.phone}
    `;

    /* -------- CUSTOMER EMAIL (EXACT FORMAT) -------- */

    await sendBrevoEmail({
      to: user.email,
      subject: "Your FrostWayne order has been placed successfully",
      htmlContent: `
        <p>Hello ${user.name || "Customer"},</p>

        <p>Thank you for shopping with <strong>FrostWayne</strong>.</p>

        <p>
          We’re happy to confirm that your order has been placed successfully.
          Below are your order details for reference.
        </p>

        <hr/>

        <h3>🧾 Order Summary</h3>
        <p>
          <strong>Order ID(s):</strong> ${orderIdString}<br/>
          <strong>Order Date:</strong> ${orderDate}<br/>
          <strong>Payment Method:</strong> ${paymentMethod}
        </p>

        <hr/>

        <h3>📦 Items Ordered</h3>
        <p>${orderItemsBlock}</p>

        <hr/>

        <h3>💰 Price Details</h3>
        <p>
          <strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}<br/>
          <strong>Discount:</strong> ₹${discountAmount.toFixed(2)}<br/>
          <strong>Shipping Fee:</strong> ₹${shippingFee.toFixed(2)}<br/>
          <strong>Total Amount Paid:</strong>
          <strong>₹${fullAmount.toFixed(2)}</strong>
        </p>

        <hr/>

        <h3>🚚 Delivery Address</h3>
        <p>${deliveryAddress}</p>

        <hr/>

        <h3>⏱ What happens next?</h3>
        <ul>
          <li>Your order is being processed by the seller</li>
          <li>You will receive another email once it is shipped</li>
          <li>Delivery usually takes <strong>3–7 business days</strong></li>
        </ul>

        <p>
          If you have any questions, feel free to contact us at
          <a href="mailto:support@frostwayne.shop">
            support@frostwayne.shop
          </a>.
        </p>

        <p>
          Thank you for choosing <strong>FrostWayne</strong>.<br/>
          We appreciate your trust in our brand.
        </p>

        <p>
          Warm regards,<br/>
          <strong>Team FrostWayne</strong><br/>
          <a href="https://www.frostwayne.shop">
            https://www.frostwayne.shop
          </a>
        </p>
      `,
    });

    /* -------- ADMIN EMAIL (ALREADY FORMATTED) -------- */

    await sendBrevoEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received | ${orderIdString}`,
      htmlContent: `
        <p>Hello Admin,</p>

        <p>
          A new order has been placed on <strong>FrostWayne</strong>.
          Please find the details below.
        </p>

        <hr/>

        <h3>📌 Order Information</h3>
        <p>
          <strong>Order ID(s):</strong> ${orderIdString}<br/>
          <strong>Order Date:</strong> ${orderDate}<br/>
          <strong>Payment Method:</strong> ${paymentMethod}<br/>
          <strong>Total Amount:</strong> ₹${fullAmount.toFixed(2)}
        </p>

        <hr/>

        <h3>👤 Customer Details</h3>
        <p>
          <strong>Name:</strong> ${user.name || "N/A"}<br/>
          <strong>Email:</strong> ${user.email}
        </p>

        <hr/>

        <h3>📦 Items Ordered</h3>
        <p>${orderItemsBlock}</p>

        <hr/>

        <h3>🚚 Shipping Address</h3>
        <p>${deliveryAddress}</p>

        <hr/>

        <h3>⚠ Action Required</h3>
        <ul>
          <li>Review the order in the admin panel</li>
          <li>Assign shipment</li>
          <li>Update order status when dispatched</li>
        </ul>

        <p>
          Admin Dashboard:<br/>
          <a href="https://www.frostwayne.shop/admin">
            https://www.frostwayne.shop/admin
          </a>
        </p>

        <p>
          —<br/>
          <strong>System Notification</strong><br/>
          FrostWayne Order Management
        </p>
      `,
    });

    return NextResponse.json(
      { message: "Order placed successfully", orderIds, fullAmount },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ---------------- GET : USER ORDERS ---------------- */

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          {
            AND: [
              { paymentMethod: PaymentMethod.STRIPE },
              { isPaid: true },
            ],
          },
        ],
      },
      include: {
        orderItems: {
          include: { product: true },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

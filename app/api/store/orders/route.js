import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

/* ---------------- UPDATE ORDER STATUS ---------------- */

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    /* ---- UPDATE ORDER STATUS ---- */

    const order = await prisma.order.update({
      where: { id: orderId, storeId },
      data: { status },
      include: {
        user: true,
        address: true,
        orderItems: { include: { product: true } },
      },
    });

    /* ---- BUILD EMAIL DATA ---- */

    const orderItemsBlock = buildOrderItemsBlock(order.orderItems);

    const deliveryAddress = `
      ${order.address.name}<br/>
      ${order.address.street}, ${order.address.city}<br/>
      ${order.address.state}, India - ${order.address.pincode}<br/>
      Phone: ${order.address.phone}
    `;

    const statusLabel = status.replace("_", " ").toUpperCase();

    /* ---- CUSTOMER STATUS UPDATE EMAIL ---- */

    try {
      await sendBrevoEmail({
        to: order.user.email,
        subject: `Your FrostWayne order is now ${statusLabel}`,
        htmlContent: `
          <p>Hello ${order.user.name || "Customer"},</p>

          <p>
            We wanted to inform you that the status of your
            <strong>FrostWayne</strong> order has been updated.
          </p>

          <hr/>

          <h3>📦 Order Status Update</h3>
          <p>
            <strong>Order ID:</strong> ${order.id}<br/>
            <strong>Current Status:</strong>
            <span style="color:#2e7d32; font-weight:bold;">
              ${statusLabel}
            </span>
          </p>

          <hr/>

          <h3>🧾 Order Details</h3>
          <p>${orderItemsBlock}</p>

          <hr/>

          <h3>🚚 Delivery Address</h3>
          <p>${deliveryAddress}</p>

          <hr/>

          <p>
            If you have any questions, feel free to contact us at
            <a href="mailto:support@frostwayne.shop">
              support@frostwayne.shop
            </a>.
          </p>

          <p>
            Thank you for shopping with <strong>FrostWayne</strong>.
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

      


    } catch (emailError) {
      console.error("Order status email failed:", emailError.message);
      // intentionally NOT throwing — order update must succeed
    }

    return NextResponse.json(
      { message: "Order status updated and customer notified" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 500 }
    );
  }
}

/* ---------------- GET : SELLER ORDERS ---------------- */

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        user: true,
        address: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

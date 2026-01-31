import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { sendBrevoEmail } from "@/lib/brevo"

export async function PATCH(req, { params }) {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // ✅ IMPORTANT FIX — params MUST be awaited
  const { returnId } = await params

  if (!returnId) {
    return NextResponse.json(
      { message: "Return ID missing" },
      { status: 400 }
    )
  }

  const { status, adminNote } = await req.json()

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status" },
      { status: 400 }
    )
  }

  // Fetch return request + verify ownership
  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id: returnId },
    include: {
      order: {
        include: {
          store: true,
        },
      },
      user: true,
    },
  })

  if (!returnRequest) {
    return NextResponse.json(
      { message: "Return request not found" },
      { status: 404 }
    )
  }

  // Seller authorization check
  if (returnRequest.order.store.userId !== userId) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    )
  }

  // Update return request
  const updated = await prisma.returnRequest.update({
    where: { id: returnId },
    data: {
      status,
      adminNote: status === "REJECTED" ? adminNote : null,
    },
  })

  // 📧 Notify customer
  if (returnRequest.user?.email) {
    if (status === "APPROVED") {
      await sendBrevoEmail({
        to: returnRequest.user.email,
        subject: "Your return request has been approved",
        htmlContent: `
          <h2>Return Approved</h2>
          <p>Your return request for order <b>${returnRequest.orderId}</b> has been approved.</p>
          <p>Our team will contact you shortly with next steps.</p>
        `,
      })
    }

    if (status === "REJECTED") {
      await sendBrevoEmail({
        to: returnRequest.user.email,
        subject: "Your return request has been rejected",
        htmlContent: `
          <h2>Return Rejected</h2>
          <p>Your return request for order <b>${returnRequest.orderId}</b> has been rejected.</p>
          <p><b>Reason:</b> ${adminNote}</p>
        `,
      })
    }
  }

  return NextResponse.json({ returnRequest: updated })
}

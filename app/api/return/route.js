import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { sendBrevoEmail } from "@/lib/brevo"
import imagekit from "@/configs/imageKit"

export async function POST(req) {
  const { userId } = getAuth(req)
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()

  const orderId = formData.get("orderId")
  const reason = formData.get("reason")
  const video = formData.get("video")
  const images = formData.getAll("images")

  if (!orderId || !reason || !video || images.length < 3) {
    return NextResponse.json(
      { message: "Invalid return data" },
      { status: 400 }
    )
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { returnRequest: true },
  })

  if (!order || order.userId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  if (order.status !== "DELIVERED") {
    return NextResponse.json(
      { message: "Return not allowed" },
      { status: 400 }
    )
  }

  if (order.returnRequest) {
    return NextResponse.json(
      { message: "Return already requested" },
      { status: 400 }
    )
  }

  const hoursPassed =
    (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60 * 60)

  if (hoursPassed > 48) {
    return NextResponse.json(
      { message: "Return window expired" },
      { status: 400 }
    )
  }

  /* ================= IMAGEKIT UPLOAD ================= */

  const imageUrls = await Promise.all(
    images.map(async image => {
      const buffer = Buffer.from(await image.arrayBuffer())

      const upload = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        folder: "returns/images",
      })

      return imagekit.url({
        path: upload.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "800" },
        ],
      })
    })
  )

  const videoBuffer = Buffer.from(await video.arrayBuffer())

  const videoUpload = await imagekit.upload({
    file: videoBuffer,
    fileName: video.name,
    folder: "returns/videos",
  })

  const videoUrl = imagekit.url({
    path: videoUpload.filePath,
  })

  /* ================= SAVE RETURN ================= */

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderId,
      userId,
      reason,
      images: imageUrls, // ✅ REAL URLs
      video: videoUrl,   // ✅ REAL URL
    },
  })

  /* ================= EMAIL SELLER ================= */

  const store = await prisma.store.findUnique({
    where: { id: order.storeId },
  })

  if (store?.email) {
    await sendBrevoEmail({
      to: store.email,
      subject: "New Return Request Received",
      htmlContent: `
        <h2>New Return Request</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/store/return-request">
          Review Return Request
        </a>
      `,
    })
  }

  return NextResponse.json({ returnRequest }, { status: 201 })
}

import imagekit from "@/configs/imageKit"
import authSeller from "@/middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// ✅ GET single product (edit mode)

export async function GET(req, context) {
  try {

    



    const { params } = context
    const { id } = await params // ✅ FIX HERE

    const { userId } = getAuth(req)
    const storeId = await authSeller(userId)

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        storeId,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}



// ✅ UPDATE single product


export async function PUT(req, context) {
  try {
    // ✅ FIX 1: unwrap params correctly
    const { id } = await context.params

    const { userId } = getAuth(req)
    const storeId = await authSeller(userId)

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()

    const hasSizes = formData.get("hasSizes") === "true"
    const sizesRaw = formData.get("sizes")

    let sizes = null
    if (hasSizes && sizesRaw) {
      sizes = JSON.parse(sizesRaw)
    }

    const name = formData.get("name")
    const description = formData.get("description")
    const price = Number(formData.get("price"))
    const mrp = Number(formData.get("mrp"))
    const category = formData.get("category")
    const images = formData.getAll("images")

    if (!name || !description || !price || !mrp || !category) {
      return NextResponse.json(
        { error: "Missing product info" },
        { status: 400 }
      )
    }

    // ✅ Ownership check (IMPORTANT)
    const existingProduct = await prisma.product.findFirst({
      where: { id, storeId },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      )
    }

    // Upload images if changed
    let imagesUrl = existingProduct.images

    if (images.length) {
      imagesUrl = await Promise.all(
        images.map(async (image) => {
          if (typeof image === "string") return image
          const buffer = Buffer.from(await image.arrayBuffer())
          const res = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "products",
          })
          return imagekit.url({ path: res.filePath })
        })
      )
    }

    // ✅ FIX 2: update by UNIQUE id only
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        mrp,
        category,
        images: imagesUrl,
        hasSizes,
        sizes
      },
    })

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

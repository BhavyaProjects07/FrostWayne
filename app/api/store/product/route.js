// add a new product to the store
import  imagekit  from "@/configs/imageKit"
import authSeller from "@/middlewares/authSeller"
import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export async function POST(request) { 
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }


        // get the data from the form

        const formData = await request.formData()

        const name = formData.get("name")
        const description = formData.get("description")
        const price = Number(formData.get("price"))
        const images = formData.getAll("images")
        const category = formData.get("category")
        const mrp = Number(formData.get("mrp"))


        if(!name || !description || !price || images.length === 0 || !category || !mrp) {
            return NextResponse.json({ error: "Missing product info" }, { status: 400 })
        }


        // Uploading Images to ImageKit

        const imagesUrl = await Promise.all(images.map(async (image) => { 
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder:"products"
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {
                        quality:"auto"
                    },
                    {
                        format : "webp"
                    },
                    {
                        width : "800"
                    }
                ]
            })
            return url
        }))

        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                images: imagesUrl,
                category,
                storeId,
            }
        })
        return NextResponse.json({ message: "Product added successfully" }, { status: 201 })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}


// get all product for a particular seller

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const products = await prisma.product.findMany({
            where: { storeId },
        })
        return NextResponse.json({ products }) 
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
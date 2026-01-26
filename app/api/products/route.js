import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category"); // 👈 NEW
    const storeId = searchParams.get("storeId");

    const keywords = search
      .toLowerCase()
      .split(" ")
      .map(w => w.trim())
      .filter(Boolean);

    let products = await prisma.product.findMany({
      where: {
        inStock: true,

        ...(storeId && { storeId }),

        // ✅ CATEGORY FILTER (EXACT MATCH / CONTAINS)
        ...(category && {
          category: {
            contains: category,
            mode: "insensitive",
          },
        }),

        // ✅ SEARCH FILTER (UNCHANGED)
        ...(keywords.length > 0 && {
          AND: keywords.map(word => ({
            OR: [
              { name: { contains: word, mode: "insensitive" } },
              { category: { contains: word, mode: "insensitive" } },
              { description: { contains: word, mode: "insensitive" } },
            ],
          })),
        }),
      },

      include: {
        rating: {
          select: {
            createdAt: true,
            rating: true,
            review: true,
            user: {
              select: { name: true, image: true },
            },
          },
        },
        store: true,
      },

      orderBy: { createdAt: "desc" },
    });
      

    // remove inactive stores
    products = products.filter(p => p.store?.isActive);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

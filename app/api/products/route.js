import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const CATEGORY_MAP = {
  men: "Mens-Clothing",
  mens: "Mens-Clothing",
  male: "Mens-Clothing",

  women: "Womens-Clothing",
  womens: "Womens-Clothing",
  female: "Womens-Clothing",

  footwear: "Footwear",
  shoes: "Footwear",
  boots: "Footwear",

  accessories: "Accessories",
};

const STOP_WORDS = ["and", "or", "for", "the", "with", "to", "of", "in"];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const rawCategory = searchParams.get("category");

    // ---------- STEP 1: extract keywords ----------
    const words = search
      .toLowerCase()
      .split(" ")
      .map(w => w.trim())
      .filter(w => w && !STOP_WORDS.includes(w));

    // ---------- STEP 2: detect category from search ----------
    let inferredCategory = null;
    for (const word of words) {
      if (CATEGORY_MAP[word]) {
        inferredCategory = CATEGORY_MAP[word];
        break;
      }
    }

    // ---------- STEP 3: final category ----------
    const category =
      rawCategory
        ? CATEGORY_MAP[rawCategory.toLowerCase()]
        : inferredCategory;

    // ---------- STEP 4: remaining keywords ----------
    const searchKeywords = words.filter(
      w => !CATEGORY_MAP[w]
    );

    const products = await prisma.product.findMany({
      where: {
        inStock: true,

        // ✅ HARD category boundary
        ...(category && {
          category: { equals: category },
        }),

        // ✅ text search ONLY inside category
        ...(searchKeywords.length > 0 && {
          OR: searchKeywords.map(word => ({
            OR: [
              { name: { contains: word, mode: "insensitive" } },
              { description: { contains: word, mode: "insensitive" } },
            ],
          })),
        }),
      },

      include: {
        rating: true,
        store: true,
      },

      orderBy: { createdAt: "desc" },
    });

    const activeProducts = products.filter(p => p.store?.isActive);

    return NextResponse.json({ products: activeProducts });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

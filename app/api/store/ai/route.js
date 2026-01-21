import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { openai } from "@/configs/openai";


async function main(base64Image , mimeType) {
    const messages = [
    
    {
        "role": "system",
            "content": `
                         You are a product listing assistant.

Analyze the product image and return ONLY raw JSON.
No markdown. No explanation.

Return exactly this JSON structure:

{
  "name": "string",
  "description": "string"
}

Name should be short and marketing friendly.
Description should be 2–3 sentences. and the product title must be 1 line.
        `
    },
    
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this Image and return Name + Description",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:${mimeType};base64,${base64Image}`
          },
        },
      ],
    }
    ];
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: messages,
    });

    const raw = response.choices[0].message.content

    // remove json and wrappers if presents

    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned)
    } catch (error) {
        throw new Error("AI did not return valid json")
    }
    return parsed;
}



export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ error : 'Not authorized'} , {status : 401})
        }

        const { base64Image, mimeType } = await request.json();

        const result = await main(base64Image, mimeType)
        return NextResponse.json({...result})

    } catch (error) {
        console.error(error)
  return NextResponse.json(
    { error: error.message || "AI analysis failed" },
    { status: 500 }
  )
    }
}
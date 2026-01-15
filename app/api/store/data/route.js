import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



// get store info and store products


export async function GET(request) {
    try {
        // Get the username from query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username').toLocaleLowerCase();

        if (!username) {
            return NextResponse.json({ message: 'Username is required' }, { status: 400 });
        }

        // get store info and inStock products with rating
        

        const store = await prisma.store.findUnique({
            where: {
                username
            },
            include:{
                product :{include : {rating:true}}
            }
        })

        if(!store){
            return NextResponse.json({ message: 'Store not found' }, { status: 404 });
        }

        return NextResponse.json(store, { status: 200 } );
    }
    
    catch (error) {
        console.error(error);
        return NextResponse.json({ error:error.code || error.message }, { status: 400 });
    }
}
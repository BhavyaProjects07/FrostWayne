// import authSeller from "@/middlewares/authSeller";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";


// export async function POST(request) {
//     try {
//         const { userId } = getAuth(request)
//         const isSeller = await authSeller(userId)

//         if (!isSeller) {
//             return NextResponse.json({ error : 'Not authorized'} , {status : 401})
//         }
//     } catch (error) {
        
//     }
// }
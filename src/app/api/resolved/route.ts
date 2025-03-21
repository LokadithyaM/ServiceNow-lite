import { NextRequest,NextResponse } from "next/server";
import redisClient from "@/lib/redis";
import Admin from "@/lib/admin";
import { connectToDatabase } from "@/lib/mongodb";

export async function PUT(req: NextRequest){
    await connectToDatabase();
    const sessionToken=req.cookies.get("session_token")?.value;
    if(!sessionToken){
        // alert("session expired i guess.");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionData = await redisClient.get(`session:${sessionToken}`);
    if (!sessionData) {
        return NextResponse.json({ message: "Session expired. Please log in again." }, { status: 401 });
    }


    const { companyId } = JSON.parse(sessionData);
    const {incidentId} = await req.json();

    // console.error(companyId);
    const User = await Admin.findOne({ _id: companyId });

    delete User.incidents[incidentId];
    
    User.markModified("incidents"); 
    await User.save();
    
    return NextResponse.json({message:"Session worked out well updated the user"},{status:200});
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Admin from "@/lib/admin";
import User from "@/lib/user"
import Company from "@/lib/company";
import { connectToDatabase } from "@/lib/mongodb";
import Redis from "@/lib/redis"; // Ensure you have Redis client setup
import crypto from "crypto"; // For generating session tokens
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const { email,companyId, password, company, allowedUsers, action} = await req.json();

    if (action === "registerAdmin") {
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            alert("User Exists");
            return NextResponse.json({ message: "User exists" }, { status: 400 });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // console.log("User Schema Paths:", Admin.schema.paths);
    
        const formattedAllowedUsers = allowedUsers.map((user: { firstName: string; lastName: string; email: string; role: string; }) => ({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            role: user.role || "user",
        }));
    
        const newUser = new Admin({
            email,
            password: hashedPassword,
            company,
            allowedUsers: formattedAllowedUsers,
            incidents: {} 
        });

        const newAdmin = new Company({
            name: company,
            adminId: newUser._id,  
        });
    
        console.log("Before saving:", newUser.toObject());

        const session = await mongoose.startSession();
        session.startTransaction();

    
        try {
            await newAdmin.save({ session });
            await newUser.save({ session });
        
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            return NextResponse.json({ message: "nope some random issue" });
        }
    
        return NextResponse.json({ message: "Registered!" });
    }
    
    if (action === "signup_user") {
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({message:"peekaBoo you already exist!! you didn't know that?"});
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await newUser.save({ session });        
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            return NextResponse.json({ message: "nope some random issue check logs" });
        }
        
        return NextResponse.json({ message: "it works!" });

        // const isValid = await bcrypt.compare(password, user.password);
        // if (!isValid) return NextResponse.json({ message: "Wrong password" }, { status: 401 });

        // const sessionToken = crypto.randomUUID();

        // const sessionData = { email, userId: user._id };
        // await Redis.set(`session:${sessionToken}`, JSON.stringify(sessionData), {
        //     EX: 3600,
        // });

        // const response = NextResponse.json({ message: "Logged in!" });
        // response.cookies.set("session_token", sessionToken, {
        //     httpOnly: true,
        //     sameSite: "lax", 
        //     secure: process.env.NODE_ENV === "production",
        //     path: "/",
        //     maxAge: 3600,
        // });

        // return response;
    }

    if (action === "login") {
        const user = await User.findOne({ email });
    
        if (!user) {
            return NextResponse.json({ message: "User does not exist." }, { status: 404 });
        }
    
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ message: "Wrong password" }, { status: 401 });
        }
    
        const cacheKey = `allowed_users:${companyId}`;
        let allowedUsers = [];

        const cachedData = await Redis.get(cacheKey);
        if (cachedData) {
            allowedUsers = JSON.parse(cachedData);
        } else {
            // 🔹 Step 4: Fetch from MongoDB & Cache for 24h
            const company = await Admin.findOne({ _id: companyId });
            
            allowedUsers = company.allowedUsers || [];
            await Redis.setEx(cacheKey, 86400, JSON.stringify(allowedUsers));
        }

        const allowedUser = allowedUsers.find((user1: { email: string; }) => user1.email === email);

        if(!allowedUser){
            alert("you don't belong here bruv")
            return NextResponse.json({ message: "you don't belong here bruv" }, { status: 401 });
        }

        
    
        const sessionToken = crypto.randomUUID();
        const sessionData = {
            email,
            userName:`${allowedUser.firstName} ${allowedUser.lastName}`,
            userId: user._id,
            companyId: companyId,
        };
    
        await Redis.set(`session:${sessionToken}`, JSON.stringify(sessionData), { EX: 3600 });
    
        const response = NextResponse.json({ message: "Logged in!" });
        response.cookies.set("session_token", sessionToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 3600,
        });
    
        return response;
    }
    

    if (action === "logout") {
        const sessionToken = (await cookies()).get("session_token")?.value;
        if (sessionToken) {
            await Redis.del(`session:${sessionToken}`);
            (await cookies()).delete("session_token");
        }
        return NextResponse.json({ message: "Logged out!" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

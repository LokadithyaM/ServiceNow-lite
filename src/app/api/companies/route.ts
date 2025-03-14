import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Company from "@/lib/company";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const companies = await Company.find().lean();

    const formattedCompanies = companies.map((company) => ({
      name: company.name,
      adminId: (company.adminId as Types.ObjectId).toString(), // Convert adminId to string
    }));

    console.log(formattedCompanies);
    return NextResponse.json(formattedCompanies, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

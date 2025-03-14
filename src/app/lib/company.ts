import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;

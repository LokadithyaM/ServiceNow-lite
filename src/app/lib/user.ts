import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


const AuthUser = mongoose.models.AuthUser || mongoose.model("AuthUser", authUserSchema);
export default AuthUser;

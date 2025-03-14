import mongoose from "mongoose";

const AllowedUserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" }
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: String, required: true },
    allowedUsers: { type: [AllowedUserSchema], default: [] },  
    incidents: { type: Object, default: {} }  
}, { minimize: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

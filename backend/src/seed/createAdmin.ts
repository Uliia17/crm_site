import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../configs/config";
import UserModel from "../models/user.model";

export async function createDefaultAdmin() {
    let connectedHere = false;
    try {
        if (!config.MONGO_URI) throw new Error("MONGO_URI not set");
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(config.MONGO_URI);
            connectedHere = true;
        }

        const email = "admin@gmail.com";
        const plainPassword = "admin";

        const existing = await UserModel.findOne({ email }).lean();
        if (existing) {
            console.log("Default admin already exists:", email);
            return;
        }

        const hashed = await bcrypt.hash(plainPassword, 10);
        const admin = await UserModel.create({
            email,
            password: hashed,
            role: "admin",
            isActive: true,
            isBanned: false,
        });

        console.log("Default admin created:", admin.email);
    } catch (err) {
        console.error("Create default admin error:", err);
    } finally {
        if (connectedHere) {
            await mongoose.disconnect();
        }
    }
}

import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { RoleEnum } from "../enums/role.enum";

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(RoleEnum),
            default: RoleEnum.MANAGER,
        },
        isActive: { type: Boolean, default: false },
        isBanned: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default model<IUser>("User", userSchema);

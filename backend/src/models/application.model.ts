import { Schema, model } from "mongoose";
import { IApplication } from "../interfaces/application.interface";

const applicationSchema = new Schema<IApplication>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        age: { type: Number, required: true },
        course: {
            type: String,
            enum: ["FS", "QACX", "JCX", "JSCX", "FE", "PCX"],
            required: true,
        },
        course_format: {
            type: String,
            enum: ["static", "online"],
            required: true,
        },
        course_type: {
            type: String,
            enum: ["pro", "minimal", "premium", "incubator", "vip"],
            required: true,
        },
        status: {
            type: String,
            enum: ["In work", "New", "Aggre", "Disaggre", "Dubbing"],
            default: "New",
        },
        sum: { type: Number, default: 0 },
        alreadyPaid: { type: Number, default: 0 },
        manager: { type: String, default: null },
        group: { type: String, default: null },
        comments: [
            {
                text: String,
                author: String,
                created_at: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } },
);

export default model<IApplication>("Application", applicationSchema);

import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config({ path: "../.env" });

interface IConfig {
    PORT: string;
    MONGO_URI: string;

    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_LIFETIME: SignOptions["expiresIn"];
    JWT_REFRESH_LIFETIME: SignOptions["expiresIn"];
    JWT_ACTIVATE_SECRET: string;
    JWT_ACTIVATE_LIFETIME: SignOptions["expiresIn"];
    JWT_RECOVERY_SECRET: string;
    JWT_RECOVERY_LIFETIME: SignOptions["expiresIn"];

    FRONTEND_URL: string;

    PASSWORD_SALT_ROUNDS: number;
}

const config: IConfig = {
    PORT: process.env.PORT || "5000",
    MONGO_URI: process.env.MONGO_URI || "",

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "supersecret-access",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "supersecret-refresh",
    JWT_ACCESS_LIFETIME: (process.env.JWT_ACCESS_LIFETIME ||
        "15m") as SignOptions["expiresIn"],
    JWT_REFRESH_LIFETIME: (process.env.JWT_REFRESH_LIFETIME ||
        "7d") as SignOptions["expiresIn"],

    JWT_ACTIVATE_SECRET:
        process.env.JWT_ACTIVATE_SECRET || "supersecret-activate",
    JWT_ACTIVATE_LIFETIME: (process.env.JWT_ACTIVATE_LIFETIME ||
        "30m") as SignOptions["expiresIn"],

    JWT_RECOVERY_SECRET:
        process.env.JWT_RECOVERY_SECRET || "supersecret-recovery",
    JWT_RECOVERY_LIFETIME: (process.env.JWT_RECOVERY_LIFETIME ||
        "10m") as SignOptions["expiresIn"],

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

    PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS
        ? Number(process.env.PASSWORD_SALT_ROUNDS)
        : 10,
};

export { config };

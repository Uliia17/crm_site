import bcrypt from "bcryptjs";
import { config } from "../configs/config";

class PasswordService {
    private readonly saltRounds = Number(config.PASSWORD_SALT_ROUNDS);

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    public async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export const passwordService = new PasswordService();

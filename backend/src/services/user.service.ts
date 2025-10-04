import { IUser, IUserResponse } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.code.enum";

class UserService {
    public async create(dto: {
        email: string;
        password: string;
        role: "admin" | "manager";
    }): Promise<IUserResponse> {
        const hashedPassword = await passwordService.hashPassword(dto.password);
        const user = await userRepository.create({
            email: dto.email,
            password: hashedPassword,
            role: dto.role as RoleEnum,
            isActive: false,
            isBanned: false,
        });

        return this.toResponse(user);
    }

    // Отримати користувача по email
    public async getByEmail(email: string): Promise<IUserResponse | null> {
        const user = await userRepository.findByEmail(email);
        return user ? this.toResponse(user) : null;
    }

    // Отримати сирого користувача без прихованих полів
    public async getRawByEmail(email: string): Promise<IUser | null> {
        return await userRepository.findRawByEmail(email);
    }

    public async getById(userId: string): Promise<IUserResponse | null> {
        const user = await userRepository.findById(userId);
        return user ? this.toResponse(user) : null;
    }

    public async updateById(
        userId: string,
        updateData: Partial<IUser>,
    ): Promise<IUserResponse> {
        const updatedUser = await userRepository.updateById(userId, updateData);
        if (!updatedUser) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return this.toResponse(updatedUser);
    }

    public async ban(userId: string): Promise<IUserResponse> {
        return await this.updateById(userId, { isBanned: true });
    }

    public async unban(userId: string): Promise<IUserResponse> {
        return await this.updateById(userId, { isBanned: false });
    }

    public async activate(userId: string): Promise<IUserResponse> {
        return await this.updateById(userId, { isActive: true });
    }

    public async getAll(): Promise<IUserResponse[]> {
        const users = await userRepository.findAll();
        return users.map((user) => this.toResponse(user));
    }

    private toResponse(
        user: IUser & { _id: any; createdAt?: Date; updatedAt?: Date },
    ): IUserResponse {
        return {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            isBanned: user.isBanned,
            createdAt: user.createdAt || new Date(),
            updatedAt: user.updatedAt || new Date(),
        };
    }
}

export const userService = new UserService();

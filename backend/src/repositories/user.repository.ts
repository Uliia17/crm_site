import UserModel from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

class UserRepository {
    async create(data: Partial<IUser>) {
        return await UserModel.create(data);
    }

    async findByEmail(email: string) {
        return await UserModel.findOne({ email });
    }

    async findById(id: string) {
        return await UserModel.findById(id);
    }

    async updateById(userId: string, updateData: Partial<IUser>) {
        return await UserModel.findByIdAndUpdate(userId, updateData, {
            new: true,
        });
    }

    async findRawByEmail(email: string) {
        return await UserModel.findOne({ email }).lean(); // повертає plain object
    }

    async findAll() {
        return await UserModel.find().select("-password");
    }
}

export const userRepository = new UserRepository();

import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

export interface IUser extends IBase {
    _id: string;
    email: string;
    password: string;
    role: RoleEnum;
    isActive: boolean;
    isBanned: boolean;
}

export interface IUserResponse extends IBase {
    _id: string;
    email: string;
    role: RoleEnum;
    isActive: boolean;
    isBanned: boolean;
}

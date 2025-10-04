import { IBase } from "./base.interface";
import { RoleEnum } from "../enums/role.enum";

interface IToken extends IBase {
    _userId: string;
    accessToken: string;
    refreshToken: string;
}

interface ITokenPayload {
    userId: string;
    role: RoleEnum;
}

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;

type ITokenRefresh = Pick<IToken, "refreshToken">;

type ITokenModel = Pick<IToken, "accessToken" | "refreshToken" | "_userId">;

export { IToken, ITokenPayload, ITokenPair, ITokenRefresh, ITokenModel };

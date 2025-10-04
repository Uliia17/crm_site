import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../configs/config";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { ActionTokenTypeEnum, TokenTypeEnum } from "../enums/token.type.enum";
import { StatusCodesEnum } from "../enums/status.code.enum";
import { normalizeExpiresIn } from "../utils/tokenHelpers";

class TokenService {
    public generateTokens(payload: ITokenPayload): ITokenPair {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        } as SignOptions);
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        } as SignOptions);

        return {
            refreshToken,
            accessToken,
        };
    }

    public generateActionToken(
        userId: string,
        type: ActionTokenTypeEnum,
    ): string {
        let secret: string;
        let expires: string | number;

        switch (type) {
            case ActionTokenTypeEnum.ACTIVATE:
                secret = config.JWT_ACTIVATE_SECRET;
                expires = normalizeExpiresIn(
                    config.JWT_ACTIVATE_LIFETIME,
                    "1h",
                );
                break;
            case ActionTokenTypeEnum.RECOVERY:
                secret = config.JWT_RECOVERY_SECRET;
                expires = normalizeExpiresIn(
                    config.JWT_RECOVERY_LIFETIME,
                    "1h",
                );
                break;
            default:
                throw new ApiError(
                    "Invalid action token type",
                    StatusCodesEnum.BAD_REQUEST,
                );
        }

        const payload = { userId, type };
        return jwt.sign(payload, secret, { expiresIn: expires } as SignOptions);
    }

    public verifyToken(
        token: string,
        type: TokenTypeEnum | ActionTokenTypeEnum,
    ): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case TokenTypeEnum.ACCESS:
                    secret = config.JWT_ACCESS_SECRET;
                    break;

                case TokenTypeEnum.REFRESH:
                    secret = config.JWT_REFRESH_SECRET;
                    break;

                case ActionTokenTypeEnum.ACTIVATE:
                    secret = config.JWT_ACTIVATE_SECRET;
                    break;

                case ActionTokenTypeEnum.RECOVERY:
                    secret = config.JWT_RECOVERY_SECRET;
                    break;

                default:
                    throw new ApiError(
                        "Invalid token type",
                        StatusCodesEnum.BAD_REQUEST,
                    );
            }
            return jwt.verify(token, secret) as ITokenPayload;
        } catch {
            throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
        }
    }

    public async isTokenExists(
        token: string,
        type: TokenTypeEnum,
    ): Promise<boolean> {
        try {
            await tokenRepository.findByParams({ [type]: token });
            return true;
        } catch {
            return false;
        }
    }

    public validateActionToken(
        token: string,
        type: ActionTokenTypeEnum,
    ): ITokenPayload {
        try {
            return this.verifyToken(token, type);
        } catch {
            throw new ApiError(
                "Invalid action token",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }
    }
}

export const tokenService = new TokenService();

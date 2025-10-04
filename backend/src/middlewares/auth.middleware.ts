import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { ITokenRefresh, ITokenPayload } from "../interfaces/token.interface";
import { TokenTypeEnum } from "../enums/token.type.enum";
import { StatusCodesEnum } from "../enums/status.code.enum";
import { tokenService } from "../services/token.service";
import { userService } from "../services/user.service";

class AuthMiddleware {
    public async checkAccessToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const accessToken = authorizationHeader.split(" ")[1];

            if (!accessToken) {
                throw new ApiError(
                    "No token provided",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const tokenPayload = tokenService.verifyToken(
                accessToken,
                TokenTypeEnum.ACCESS,
            );
            const isTokenExists = await tokenService.isTokenExists(
                accessToken,
                TokenTypeEnum.ACCESS,
            );

            if (!isTokenExists) {
                throw new ApiError(
                    "Invalid token",
                    StatusCodesEnum.UNAUTHORIZED,
                );
            }

            const manager = await userService.getById(tokenPayload.userId);
            if (!manager || !manager.isActive) {
                throw new ApiError(
                    "Account is not active",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            res.locals.tokenPayload = tokenPayload;

            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { refreshToken } = req.body as ITokenRefresh;

            if (!refreshToken) {
                throw new ApiError(
                    "No refresh token provided",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            const tokenPayload = tokenService.verifyToken(
                refreshToken,
                TokenTypeEnum.REFRESH,
            );
            const isTokenExists = await tokenService.isTokenExists(
                refreshToken,
                TokenTypeEnum.REFRESH,
            );

            if (!isTokenExists) {
                throw new ApiError("Invalid token", StatusCodesEnum.FORBIDDEN);
            }

            res.locals.tokenPayload = tokenPayload;

            next();
        } catch (e) {
            next(e);
        }
    }

    public isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload as
                | ITokenPayload
                | undefined;

            if (!payload || !payload.role) {
                throw new ApiError(
                    "No token payload",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            if (payload.role !== RoleEnum.ADMIN) {
                throw new ApiError("No permission", StatusCodesEnum.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    }

    // (опційно) метод для менеджерів, якщо знадобиться
    public isManagerOrAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload as
                | ITokenPayload
                | undefined;

            if (!payload || !payload.role) {
                throw new ApiError(
                    "No token payload",
                    StatusCodesEnum.FORBIDDEN,
                );
            }

            if (
                payload.role !== RoleEnum.MANAGER &&
                payload.role !== RoleEnum.ADMIN
            ) {
                throw new ApiError("No permission", StatusCodesEnum.FORBIDDEN);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();

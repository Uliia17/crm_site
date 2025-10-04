import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "./token.service";
import { IAuth } from "../interfaces/auth.interface";
import { StatusCodesEnum } from "../enums/status.code.enum";
import { passwordService } from "./password.service";
import { IUserResponse } from "../interfaces/user.interface";
import { userService } from "./user.service";
import { RoleEnum } from "../enums/role.enum";
import { ActionTokenTypeEnum } from "../enums/token.type.enum";

class AuthService {
    public async signIn(
        dto: IAuth,
    ): Promise<{ user: IUserResponse; tokens?: ITokenPair }> {
        if (!dto.email || !dto.password) {
            throw new ApiError(
                "Email and password are required",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const rawUser = await userService.getRawByEmail(dto.email);

        if (!rawUser || !rawUser.password) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const valid = await passwordService.comparePassword(
            dto.password,
            rawUser.password,
        );

        if (!valid) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const user = await userService.getByEmail(dto.email);
        if (!user) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        // 🚨 НОВА ПЕРЕВІРКА — якщо акаунт не активований
        if (!user.isActive) {
            throw new ApiError(
                "Account is not active. Please activate your account before logging in.",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        // 🔑 Токени генеруємо тільки якщо користувач активний
        const tokens = tokenService.generateTokens({
            userId: user._id.toString(),
            role: user.role,
        });

        await tokenRepository.create({
            _userId: user._id.toString(),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });

        return { user, tokens };
    }

    public async refresh(tokenPayload: ITokenPayload): Promise<ITokenPair> {
        const { userId, role } = tokenPayload;

        const tokens = tokenService.generateTokens({ userId, role });

        await tokenRepository.create({
            _userId: userId.toString(),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });

        return tokens;
    }

    public async me(tokenPayload: ITokenPayload): Promise<IUserResponse> {
        const user = await userService.getById(tokenPayload.userId);
        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return user;
    }

    public async generateActivationLink(
        userId: string,
        requesterRole: RoleEnum,
    ): Promise<string> {
        if (requesterRole !== RoleEnum.ADMIN) {
            throw new ApiError("No permission", StatusCodesEnum.FORBIDDEN);
        }

        const user = await userService.getById(userId);
        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        if (user.isActive) {
            throw new ApiError(
                "User is already active",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const token = tokenService.generateActionToken(
            userId,
            ActionTokenTypeEnum.ACTIVATE,
        );

        return `${process.env.FRONTEND_URL}/activate/${token}`;
    }

    public async confirmActivation(token: string): Promise<void> {
        const payload = tokenService.validateActionToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );
        await userService.activate(payload.userId);
    }

    public async generateRecoveryLink(email: string): Promise<string> {
        const user = await userService.getRawByEmail(email);
        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        // Якщо користувач не активний, можна відправляти лінк? або заборонити
        if (!user.isActive) {
            throw new ApiError(
                "User is not active",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const token = tokenService.generateActionToken(
            user._id.toString(),
            ActionTokenTypeEnum.RECOVERY,
        );

        return `${process.env.FRONTEND_URL}/recovery/${token}`;
    }

    // Підтвердження recovery і зміна пароля
    public async resetPassword(
        token: string,
        newPassword: string,
    ): Promise<void> {
        const payload = tokenService.validateActionToken(
            token,
            ActionTokenTypeEnum.RECOVERY,
        );

        const user = await userService.getById(payload.userId);
        if (!user) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }

        // Хешуємо новий пароль і зберігаємо
        await userService.updateById(payload.userId, {
            password: await passwordService.hashPassword(newPassword),
        });
    }
}

export const authService = new AuthService();

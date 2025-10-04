import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { StatusCodesEnum } from "../enums/status.code.enum";
import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { RoleEnum } from "../enums/role.enum";

export class AuthController {
    public signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as IAuth;
            const data = await authService.signIn(dto);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (err: unknown) {
            next(err);
        }
    };

    public me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            const user = await authService.me(tokenPayload);
            res.status(StatusCodesEnum.OK).json(user);
        } catch (err: unknown) {
            next(err);
        }
    };

    public refresh = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            const tokens = await authService.refresh(tokenPayload);
            res.status(StatusCodesEnum.OK).json(tokens);
        } catch (err: unknown) {
            next(err);
        }
    };

    // Admin: згенерувати activation link (повертає URL)
    public generateActivationLink = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const requesterRole = res.locals.tokenPayload?.role as RoleEnum;
            const { userId } = req.params;
            const link = await authService.generateActivationLink(
                userId,
                requesterRole,
            );
            res.status(StatusCodesEnum.OK).json({ activationLink: link });
        } catch (err: unknown) {
            next(err);
        }
    };

    // підтвердження активації — користувач переходить по лінку з токеном
    public confirmActivation = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            // ми допускаємо token в params або в body
            const token =
                (req.params.token as string) || (req.body.token as string);
            if (!token) {
                return res
                    .status(StatusCodesEnum.BAD_REQUEST)
                    .json({ message: "Token required" });
            }
            await authService.confirmActivation(token);
            res.status(StatusCodesEnum.OK).json({
                message: "Account activated",
            });
        } catch (err: unknown) {
            next(err);
        }
    };

    public sendRecoveryLink = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res
                    .status(StatusCodesEnum.BAD_REQUEST)
                    .json({ message: "Email required" });
            }

            const link = await authService.generateRecoveryLink(email);
            res.status(StatusCodesEnum.OK).json({ recoveryLink: link });
        } catch (err: unknown) {
            next(err);
        }
    };

    public confirmRecovery = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res
                    .status(StatusCodesEnum.BAD_REQUEST)
                    .json({ message: "Token and newPassword required" });
            }

            await authService.resetPassword(token, newPassword);
            res.status(StatusCodesEnum.OK).json({
                message: "Password updated",
            });
        } catch (err: unknown) {
            next(err);
        }
    };
}

export const authController = new AuthController();

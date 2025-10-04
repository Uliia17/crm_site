import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { StatusCodesEnum } from "../enums/status.code.enum";
import { RoleEnum } from "../enums/role.enum";

export class UserController {
    // створити менеджера (тільки admin)
    public async createManager(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const payload = res.locals.tokenPayload;
            if (!payload || payload.role !== RoleEnum.ADMIN) {
                return res
                    .status(StatusCodesEnum.FORBIDDEN)
                    .json({ message: "No permission" });
            }

            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(StatusCodesEnum.BAD_REQUEST)
                    .json({ message: "Email and password are required" });
            }

            const user = await userService.create({
                email,
                password,
                role: "manager",
            });

            res.status(StatusCodesEnum.CREATED).json(user);
        } catch (err: any) {
            // Ловимо конкретно помилку дубліката email
            if (err.code === 11000 && err.keyPattern?.email) {
                return res.status(StatusCodesEnum.CONFLICT).json({
                    message: "Email вже використовується. Виберіть інший.",
                });
            }
            next(err);
        }
    }

    // бан/розбан користувача (тільки admin)
    public async toggleBan(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload;
            if (!payload || payload.role !== RoleEnum.ADMIN) {
                return res
                    .status(StatusCodesEnum.FORBIDDEN)
                    .json({ message: "No permission" });
            }

            const { userId } = req.params;

            const user = await userService.getById(userId);
            if (!user) {
                return res
                    .status(StatusCodesEnum.NOT_FOUND)
                    .json({ message: "User not found" });
            }

            const updatedUser = user.isBanned
                ? await userService.unban(userId)
                : await userService.ban(userId);

            res.status(StatusCodesEnum.OK).json(updatedUser);
        } catch (err: unknown) {
            next(err);
        }
    }

    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = res.locals.tokenPayload;
            if (!payload || payload.role !== RoleEnum.ADMIN) {
                return res
                    .status(StatusCodesEnum.FORBIDDEN)
                    .json({ message: "No permission" });
            }

            const roleFilter = req.query.role as string | undefined;

            let users = await userService.getAll();

            if (roleFilter) {
                users = users.filter((u) => u.role === roleFilter);
            }

            res.status(StatusCodesEnum.OK).json(users);
        } catch (err) {
            next(err);
        }
    }
}

export const userController = new UserController();

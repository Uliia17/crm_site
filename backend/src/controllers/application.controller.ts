import { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service";
import { StatusCodesEnum } from "../enums/status.code.enum";

class ApplicationController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 25;

            const filters: any = {};
            if (req.query.status) filters.status = req.query.status;
            if (req.query.manager) filters.manager = req.query.manager;
            if (req.query.email)
                filters.email = { $regex: req.query.email, $options: "i" };

            const sort: any = {};
            if (req.query.sortBy) {
                sort[req.query.sortBy as string] =
                    req.query.order === "asc" ? 1 : -1;
            } else {
                sort.createdAt = -1;
            }

            const result = await applicationService.getAllApplications(
                page,
                pageSize,
                filters,
                sort,
            );

            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    public getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const application = await applicationService.getApplicationById(id);
            res.json(application);
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(StatusCodesEnum.NOT_FOUND).json({
                    message: e.message,
                });
            } else {
                res.status(StatusCodesEnum.INTERNAL_SERVER_ERROR).json({
                    message: "Unknown error",
                });
            }
        }
    };

    public updateById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updated = await applicationService.updateApplicationById(
                id,
                updateData,
            );
            res.json(updated);
        } catch (e) {
            next(e);
        }
    };

    public addComment = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { text, author } = req.body;
            const updated = await applicationService.addCommentToApplication(
                id,
                { text, author },
            );
            res.json(updated);
        } catch (e) {
            next(e);
        }
    };
}

export const applicationController = new ApplicationController();

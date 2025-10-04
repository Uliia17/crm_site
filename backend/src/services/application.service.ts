import { IApplication } from "../interfaces/application.interface";
import { applicationRepository } from "../repositories/application.repository";
import ApplicationModel from "../models/application.model";
import { IPaginated } from "../interfaces/paginated.interface";

class ApplicationService {
    public async getAllApplications(
        page: number,
        pageSize: number,
        filters: any,
        sort: any,
    ): Promise<IPaginated<IApplication>> {
        const totalItems = await ApplicationModel.countDocuments(filters);
        const totalPages = Math.ceil(totalItems / pageSize);

        const apps = await ApplicationModel.find(filters)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            data: apps,
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            page,
            pageSize,
        };
    }

    async getApplicationById(id: string): Promise<IApplication | null> {
        const application = await applicationRepository.findById(id);
        if (!application) {
            throw new Error("Application not found");
        }
        return application;
    }

    async updateApplicationById(
        id: string,
        updateData: Partial<IApplication>,
    ): Promise<IApplication | null> {
        // Можна додати логіку перевірки прав користувача
        return await applicationRepository.updateById(id, updateData);
    }

    async addCommentToApplication(
        id: string,
        comment: { text: string; author: string },
    ): Promise<IApplication | null> {
        const commentWithDate = { ...comment, created_at: new Date() };
        return await applicationRepository.addComment(id, commentWithDate);
    }
}

export const applicationService = new ApplicationService();

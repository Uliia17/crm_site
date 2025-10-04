import ApplicationModel from "../models/application.model";
import { IApplication } from "../interfaces/application.interface";

class ApplicationRepository {
    async findAll(
        page: number,
        pageSize: number,
        filters: any = {},
        sort: any = { created_at: -1 },
    ) {
        const totalItems = await ApplicationModel.countDocuments(filters);
        const applications = await ApplicationModel.find(filters)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            data: applications,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            page,
            pageSize,
        };
    }

    async findById(id: string) {
        return await ApplicationModel.findById(id);
    }

    async updateById(id: string, data: Partial<IApplication>) {
        return await ApplicationModel.findByIdAndUpdate(id, data, {
            new: true,
        });
    }

    async addComment(
        id: string,
        comment: { text: string; author: string; created_at: Date },
    ) {
        return await ApplicationModel.findByIdAndUpdate(
            id,
            { $push: { comments: comment } },
            { new: true },
        );
    }
}

export const applicationRepository = new ApplicationRepository();

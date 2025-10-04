export interface IPaginated<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    prevPage: boolean;
    nextPage: boolean;
    page: number;
    pageSize: number;
}

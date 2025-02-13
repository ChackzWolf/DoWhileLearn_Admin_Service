import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
export declare class BaseRepository<T extends Document> {
    private model;
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
    deleteById(id: string): Promise<boolean>;
    findAll(): Promise<T[]>;
}

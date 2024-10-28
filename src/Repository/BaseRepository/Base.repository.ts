import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

// BaseRepository is a generic class to perform CRUD operations
export class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // Create a new document
    async create(data: Partial<T>): Promise<T> {
        try {
            const doc = new this.model(data);
            return await doc.save();
        } catch (error) {
            throw new Error(`Error creating document: ${error}`);
        }
    }

    // Find a document by its ID
    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).exec();
        } catch (error) {
            throw new Error(`Error finding document by ID: ${error}`);
        }
    }

    // Find a document based on a filter
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).exec();
        } catch (error) {
            throw new Error(`Error finding document: ${error}`);
        }
    }

    // Update a document by its ID
    async updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
        } catch (error) {
            throw new Error(`Error updating document: ${error}`);
        }
    }

    // Delete a document by its ID
    async deleteById(id: string): Promise<boolean> {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result ? true : false;
        } catch (error) {
            throw new Error(`Error deleting document: ${error}`);
        }
    }

    // Find all documents
    async findAll(): Promise<T[]> {
        try {
            return await this.model.find().exec();
        } catch (error) {
            throw new Error(`Error finding documents: ${error}`);
        }
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
// BaseRepository is a generic class to perform CRUD operations
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    // Create a new document
    async create(data) {
        try {
            const doc = new this.model(data);
            return await doc.save();
        }
        catch (error) {
            throw new Error(`Error creating document: ${error}`);
        }
    }
    // Find a document by its ID
    async findById(id) {
        try {
            return await this.model.findById(id).exec();
        }
        catch (error) {
            throw new Error(`Error finding document by ID: ${error}`);
        }
    }
    // Find a document based on a filter
    async findOne(filter) {
        try {
            return await this.model.findOne(filter).exec();
        }
        catch (error) {
            throw new Error(`Error finding document: ${error}`);
        }
    }
    // Update a document by its ID
    async updateById(id, updateData) {
        try {
            return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
        }
        catch (error) {
            throw new Error(`Error updating document: ${error}`);
        }
    }
    // Delete a document by its ID
    async deleteById(id) {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result ? true : false;
        }
        catch (error) {
            throw new Error(`Error deleting document: ${error}`);
        }
    }
    // Find all documents
    async findAll() {
        try {
            return await this.model.find().exec();
        }
        catch (error) {
            throw new Error(`Error finding documents: ${error}`);
        }
    }
}
exports.BaseRepository = BaseRepository;

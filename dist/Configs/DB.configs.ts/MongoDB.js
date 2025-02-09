"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const ENV_configs_1 = require("../ENV_configs/ENV.configs");
const connectDB = async () => {
    try {
        if (!ENV_configs_1.configs.MONGODB_URL_ADMIN) {
            throw new Error("MONGODB_URL_ADMIN is not defined in the environment variables");
        }
        await mongoose_1.default.connect(ENV_configs_1.configs.MONGODB_URL_ADMIN);
        console.log("Admin DB connected");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;

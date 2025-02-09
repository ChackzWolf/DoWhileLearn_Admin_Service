"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.configs = {
    // LISTENER PORT
    PORT: process.env.PORT || 3006,
    // GRPC PORT CONFIG
    ADMIN_GRPC_PORT: process.env.ADMIN_GRPC_PORT || 5006,
    // DWL EMAIL CONFIGS
    DWL_EMAIL: process.env.EMAIL || 'dowhilelearn05@gmail.com',
    DWL_PASSWORD: process.env.PASSWORD || '',
    // DB COFNIGS
    MONGODB_URL_ADMIN: process.env.MONGODB_URL_ADMIN || '',
    //JWT CONFIGS
    JWT_SECRET: process.env.JWT_SECRET || '',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '1m',
    REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '10d',
    // LOGGER CONFIGS
    LOG_RETENTION_DAYS: process.env.LOG_RETENTION_DAYS || '7d'
};

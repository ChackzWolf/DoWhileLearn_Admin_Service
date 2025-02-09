"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ENV_configs_1 = require("../Configs/ENV_configs/ENV.configs");
dotenv_1.default.config();
const JWT_SECRET = ENV_configs_1.configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = ENV_configs_1.configs.REFRESH_TOKEN_SECRET;
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. ");
}
const createToken = (admin) => {
    const accessToken = jsonwebtoken_1.default.sign({
        id: admin._id,
        role: 'ADMIN',
        email: admin.email,
    }, JWT_SECRET, { expiresIn: ENV_configs_1.configs.JWT_EXPIRATION_TIME });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: admin._id,
        role: 'ADMIN',
        email: admin.email,
    }, REFRESH_TOKEN_SECRET, { expiresIn: ENV_configs_1.configs.REFRESH_TOKEN_EXPIRATION_TIME });
    return { accessToken, refreshToken };
};
exports.default = createToken;

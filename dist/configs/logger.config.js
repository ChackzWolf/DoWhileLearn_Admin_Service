"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const morgan_1 = __importDefault(require("morgan"));
const ENV_configs_1 = require("./ENV_configs/ENV.configs");
exports.logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: ENV_configs_1.configs.LOG_RETENTION_DAYS,
        }),
    ],
});
exports.morganMiddleware = (0, morgan_1.default)("combined", {
    stream: { write: (message) => exports.logger.info(message.trim()) },
});

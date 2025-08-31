"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const MongoDB_1 = require("./configs/DB.configs/MongoDB");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const logger_config_1 = require("./configs/logger.config");
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    (0, MongoDB_1.connectDB)();
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => logger_config_1.logger.info(message.trim()),
        },
    }));
    return app;
};
exports.createApp = createApp;

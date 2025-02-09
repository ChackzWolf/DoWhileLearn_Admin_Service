"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grpcServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const Admin_Controller_1 = require("./Controllers/Admin.Controller");
const MongoDB_1 = require("./Configs/DB.configs.ts/MongoDB");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const ENV_configs_1 = require("./Configs/ENV_configs/ENV.configs");
const Admin_services_1 = require("./Services/Admin.services");
const Admin_repository_1 = __importDefault(require("./Repository/AdminRepository/Admin.repository"));
const app = (0, express_1.default)();
(0, MongoDB_1.connectDB)();
dotenv_1.default.config();
// error log
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(), // Log to the console
        new winston_daily_rotate_file_1.default({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: ENV_configs_1.configs.LOG_RETENTION_DAYS
        })
    ],
});
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));
// error log end
const packageDefinition = protoLoader.loadSync(path_1.default.join(__dirname, "protos/admin.proto"), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const adminProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();
const grpcServer = () => {
    server.bindAsync(`0.0.0.0:${ENV_configs_1.configs.ADMIN_GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.log(err, "Error happened grpc admin service.");
            return;
        }
        else {
            console.log("ADMIN_SERVICE running on port", port);
        }
    });
};
exports.grpcServer = grpcServer;
const adminRepository = new Admin_repository_1.default();
const adminService = new Admin_services_1.AdminService(adminRepository);
const adminController = new Admin_Controller_1.AdminController(adminService);
server.addService(adminProto.AdminService.service, {
    Login: adminController.Login.bind(adminController),
    SendOtpToEmail: adminController.sendOtpToEmail.bind(adminController),
    ResendOtpToEmail: adminController.resendOtpToEmail.bind(adminController),
    VerifyOTPResetPassword: adminController.VerifyEnteredOTP.bind(adminController),
    ResetPassword: adminController.resetPassword.bind(adminController),
    Test: adminController.test.bind(adminController)
});
// Start Kafka consumer
adminController.start()
    .catch(error => console.error('Failed to start kafka course service:', error));
const PORT = ENV_configs_1.configs.PORT;
app.listen(PORT, () => {
    console.log(`Course service running on port ${PORT}`);
});

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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGrpcServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const ENV_configs_1 = require("../configs/ENV_configs/ENV.configs");
const admin_grpc_controller_1 = require("../controllers/grpc-controller/admin-grpc.controller");
const startGrpcServer = (adminService) => {
    const packageDefinition = protoLoader.loadSync(path_1.default.join(__dirname, "../protos/admin.proto"), { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
    const adminProto = grpc.loadPackageDefinition(packageDefinition);
    const server = new grpc.Server();
    const adminController = new admin_grpc_controller_1.AdminController(adminService);
    server.addService(adminProto.AdminService.service, {
        Login: adminController.Login.bind(adminController),
        SendOtpToEmail: adminController.sendOtpToEmail.bind(adminController),
        ResendOtpToEmail: adminController.resendOtpToEmail.bind(adminController),
        VerifyOTPResetPassword: adminController.VerifyEnteredOTP.bind(adminController),
        ResetPassword: adminController.resetPassword.bind(adminController),
        Test: adminController.test.bind(adminController),
    });
    server.bindAsync(`0.0.0.0:${ENV_configs_1.configs.ADMIN_GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error("gRPC startup error:", err);
            return;
        }
        console.log(`gRPC AdminService running on port ${port}`);
    });
};
exports.startGrpcServer = startGrpcServer;

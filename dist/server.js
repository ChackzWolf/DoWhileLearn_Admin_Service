"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const grpc_server_1 = require("./grpc/grpc-server");
const ENV_configs_1 = require("./configs/ENV_configs/ENV.configs");
const admin_auth_service_1 = require("./services/admin-auth.service");
const Admin_repository_1 = __importDefault(require("./repository/AdminRepository/Admin.repository"));
const admin_service_1 = require("./services/admin.service");
const kafka_server_1 = require("./kafka/kafka-server");
const app = (0, app_1.createApp)();
app.listen(ENV_configs_1.configs.PORT, () => {
    console.log(`Admin service running on port ${ENV_configs_1.configs.PORT}`);
});
const adminAuthService = new admin_auth_service_1.AdminAuthService();
const adminRepository = new Admin_repository_1.default();
const adminService = new admin_service_1.AdminService(adminRepository, adminAuthService);
(0, kafka_server_1.startKafkaServer)(adminService);
(0, grpc_server_1.startGrpcServer)(adminService);

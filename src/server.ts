import { createApp } from "./app";
import { startGrpcServer } from "./grpc/grpc-server";
import { configs } from "./configs/ENV_configs/ENV.configs";
import { AdminKafkaController } from "./controllers/kafka-controller/admin-kafka.controller";
import { AdminAuthService } from "./services/admin-auth.service";
import AdminRepository from "./repository/AdminRepository/Admin.repository";
import { AdminService } from "./services/admin.service";
import { startKafkaServer } from "./kafka/kafka-server";

const app = createApp();

app.listen(configs.PORT, () => {
  console.log(`Admin service running on port ${configs.PORT}`);
});

const adminAuthService = new AdminAuthService()
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository, adminAuthService);

startKafkaServer(adminService)
startGrpcServer(adminService);
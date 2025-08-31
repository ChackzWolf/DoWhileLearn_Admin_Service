import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { configs } from "../configs/ENV_configs/ENV.configs";
import { AdminController } from "../controllers/grpc-controller/admin-grpc.controller";
import { IAdminService } from "../services/Interfaces/IService.interfaces";

export const startGrpcServer = (adminService: IAdminService) => {
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "../protos/admin.proto"),
    { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
  );

  const adminProto = grpc.loadPackageDefinition(packageDefinition) as any;
  const server = new grpc.Server();
  
  const adminController = new AdminController(adminService);

  server.addService(adminProto.AdminService.service, {
    Login: adminController.Login.bind(adminController),
    SendOtpToEmail: adminController.sendOtpToEmail.bind(adminController),
    ResendOtpToEmail: adminController.resendOtpToEmail.bind(adminController),
    VerifyOTPResetPassword: adminController.VerifyEnteredOTP.bind(adminController),
    ResetPassword: adminController.resetPassword.bind(adminController),
    Test: adminController.test.bind(adminController),
  });

  server.bindAsync(
    `0.0.0.0:${configs.ADMIN_GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("gRPC startup error:", err);
        return;
      }
      console.log(`gRPC AdminService running on port ${port}`);
    }
  );
};

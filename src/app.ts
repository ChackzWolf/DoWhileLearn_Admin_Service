import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { AdminController }  from "./Controllers/Admin.Controller";
import { connectDB } from "./Configs/DB.configs.ts/MongoDB"
import express from "express"
import morgan from 'morgan';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { configs } from "./Configs/ENV_configs/ENV.configs";
import { AdminService } from "./Services/Admin.services";
import AdminRepository from "./Repository/AdminRepository/Admin.repository";
const app = express()

connectDB()
dotenv.config()

// error log
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine( 
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(), // Log to the console
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: configs.LOG_RETENTION_DAYS
      })
    ],
  });
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
// error log end



const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "protos/admin.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
)

const adminProto = grpc.loadPackageDefinition(packageDefinition) as any;
 
const server = new grpc.Server()

export const grpcServer = () => {  
    server.bindAsync( 
        `0.0.0.0:${configs.ADMIN_GRPC_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (err,port)=>{
            if(err){
                console.log(err, "Error happened grpc admin service.");
                return; 
            }else{
                console.log("ADMIN_SERVICE running on port", port);
            }
        }
    )
}


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService) 


server.addService(adminProto.AdminService.service, {
    Login: adminController.Login.bind(adminController),
    SendOtpToEmail: adminController.sendOtpToEmail.bind(adminController),
    ResendOtpToEmail: adminController.resendOtpToEmail.bind(adminController),
    VerifyOTPResetPassword : adminController.VerifyEnteredOTP.bind(adminController),
    ResetPassword: adminController.resetPassword.bind(adminController),
    Test: adminController.test.bind(adminController)
})

// Start Kafka consumer
adminController.start()
  .catch(error => console.error('Failed to start kafka course service:', error));

const PORT = configs.PORT; 
app.listen(PORT, () => {
  console.log(`Admin service running on port ${PORT}`);
  console.log(configs.JWT_SECRET, 'jwt secret');
});
 
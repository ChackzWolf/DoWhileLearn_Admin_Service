import { AdminService } from "../Services/Admin.services";
import * as grpc from '@grpc/grpc-js';
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
import { KafkaMessage } from 'kafkajs';
export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string; 
    tutorShare: string;
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
  }





const adminService = new AdminService()

export class AdminController {
    async start(): Promise<void> {
        await kafkaConfig.consumeMessages(
          'order-service-group',
          ['payment.success','transaction-failed'],
          this.handleMessage.bind(this)
        );
      }

      // checking order  success or fail
      private async handleMessage(message: KafkaMessage): Promise<void> {
          try {
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha')
            if(paymentEvent.status !== 'SUCCESS'){
              await adminService.handleOrderTransactionFail(paymentEvent.adminShare)
              return
            }
            await adminService.handleOrderSuccess(paymentEvent);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }





    async Login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>{
        try{
            console.log('trigerererere')
            const data = call.request;
            
            const response = await adminService.adminLogin(data);
            console.log(response, 'response')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError)
        }
    }

    async resetPassword(call: grpc.ServerUnaryCall<any,any>, callback:grpc.sendUnaryData<any>): Promise<void> {
        try{
            console.log('trig respassword controller')
            const data = call.request;
            const response = await adminService.resetPassword(data)
            console.log(response)
            callback(null, response)
        }catch(error){
            callback(error as grpc.ServiceError);
        }
    } 

    async sendOtpToEmail (call: grpc.ServerUnaryCall<any,any>, callback:grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig to otp email send controller ', call.request)
            const data = call.request;
            const response = await adminService.sendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }
    async resendOtpToEmail(call: grpc.ServerUnaryCall<any,any>, callback:grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig to resend otp email send controller ', call.request);
            const data = call.request;
            const response = await adminService.resendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async VerifyEnteredOTP (call: grpc.ServerUnaryCall<any,any>, callback:grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig', call.request);
            const data = call.request;
            const response = await adminService.resetPasswordVerifyOTP(data);
            console.log(response,'response from controller')
            callback(null,response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }
}
import * as grpc from '@grpc/grpc-js';
import { kafkaConfig } from "../configs/Kafka.configs/Kafka.config";
import { KafkaMessage } from 'kafkajs';
import { OrderEventData } from "../contracts/events";
import { LoginRequest, LoginResponse, OTPResponse, ResendOtpEmail, ResendOtpResponse, ResetPasswordRequest, ResetPasswordResponse, SendOtpResponse, TestResponse, VerifyOTPResetPasswordRequest } from '../contracts/admin.types';
import { IAdminService } from '../services/Interfaces/IService.interfaces';



export class AdminController {

    private adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this.adminService = adminService;
    }



    async start(): Promise<void> {
        const topics = [
            'admin.update',
            'admin-service.rollback'
        ];
        await kafkaConfig.consumeMessages(
            'admin-service-group',
            topics,
            this.routeMessage.bind(this)
        );
    }


    async routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void> {
        try {
            switch (topic) {
                case 'admin.update':
                    await this.handleMessage(message);
                    break;
                case 'admin-service.rollback':
                    await this.handleRollback(message);
                    break;
                default:
                    console.warn(`Unhandled topic: ${topic}`);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }


    async handleMessage(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha')

            await this.adminService.handleOrderSuccess(paymentEvent);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    async handleRollback(message: KafkaMessage): Promise<void> {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('START Role back', paymentEvent, 'MESAGe haaha');
            await this.adminService.handleOrderTransactionFail(paymentEvent.data)
        } catch (error) {
            console.error('Error processing message:', error)
        }
    }

    async Login(call: grpc.ServerUnaryCall<LoginRequest, LoginResponse>, callback: grpc.sendUnaryData<LoginResponse>): Promise<void> {
        try {
            console.log('trigerererere')
            const data = call.request;

            const response = await this.adminService.adminLogin(data);
            console.log(response, 'response')
            callback(null, response);
        } catch (err) {
            callback(err as grpc.ServiceError)
        }
    }

    async resetPassword(call: grpc.ServerUnaryCall<ResetPasswordRequest, ResetPasswordResponse>, callback: grpc.sendUnaryData<ResetPasswordResponse>): Promise<void> {
        try {
            console.log('trig respassword controller')
            const data = call.request;
            const response = await this.adminService.resetPassword(data)
            console.log(response)
            callback(null, response)
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async sendOtpToEmail(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, SendOtpResponse>, callback: grpc.sendUnaryData<SendOtpResponse>): Promise<void> {
        try {
            console.log('trig to otp email send controller ', call.request)
            const data = call.request;
            const response = await this.adminService.sendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }
    async resendOtpToEmail(call: grpc.ServerUnaryCall<ResendOtpEmail, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void> {
        try {
            console.log('trig to resend otp email send controller ', call.request);
            const data = call.request;
            const response = await this.adminService.resendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    async VerifyEnteredOTP(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, OTPResponse>, callback: grpc.sendUnaryData<OTPResponse>): Promise<void> {
        try {
            console.log('trig', call.request);
            const data = call.request;
            const response = await this.adminService.resetPasswordVerifyOTP(data);
            console.log(response, 'response from controller')
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError);
        }
    }

    test(_call: grpc.ServerUnaryCall<null, TestResponse>, callback: grpc.sendUnaryData<TestResponse>): void {
        callback(null, { success: true });
    }
}
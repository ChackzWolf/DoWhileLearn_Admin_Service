import { AdminService } from "../Services/Admin.services";
import * as grpc from '@grpc/grpc-js';
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
    paymentStatus: boolean;
    timestamp: Date;
    status: string;
}
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    start(): Promise<void>;
    routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void>;
    handleMessage(message: KafkaMessage): Promise<void>;
    handleRollback(message: KafkaMessage): Promise<void>;
    Login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    resetPassword(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    sendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    resendOtpToEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    VerifyEnteredOTP(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    test(_call: grpc.ServerUnaryCall<null, {
        success: boolean;
    }>, callback: grpc.sendUnaryData<{
        success: boolean;
    }>): void;
}

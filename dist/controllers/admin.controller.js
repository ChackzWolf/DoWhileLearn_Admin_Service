"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Kafka_config_1 = require("../configs/Kafka.configs/Kafka.config");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async start() {
        const topics = [
            'admin.update',
            'admin-service.rollback'
        ];
        await Kafka_config_1.kafkaConfig.consumeMessages('admin-service-group', topics, this.routeMessage.bind(this));
    }
    async routeMessage(topics, message, topic) {
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
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async handleMessage(message) {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha');
            await this.adminService.handleOrderSuccess(paymentEvent);
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async handleRollback(message) {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('START Role back', paymentEvent, 'MESAGe haaha');
            await this.adminService.handleOrderTransactionFail(paymentEvent.data);
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async Login(call, callback) {
        try {
            console.log('trigerererere');
            const data = call.request;
            const response = await this.adminService.adminLogin(data);
            console.log(response, 'response');
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    async resetPassword(call, callback) {
        try {
            console.log('trig respassword controller');
            const data = call.request;
            const response = await this.adminService.resetPassword(data);
            console.log(response);
            callback(null, response);
        }
        catch (error) {
            callback(error);
        }
    }
    async sendOtpToEmail(call, callback) {
        try {
            console.log('trig to otp email send controller ', call.request);
            const data = call.request;
            const response = await this.adminService.sendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        }
        catch (error) {
            callback(error);
        }
    }
    async resendOtpToEmail(call, callback) {
        try {
            console.log('trig to resend otp email send controller ', call.request);
            const data = call.request;
            const response = await this.adminService.resendEmailOtp(data);
            console.log('reseponse from controller', response);
            callback(null, response);
        }
        catch (error) {
            callback(error);
        }
    }
    async VerifyEnteredOTP(call, callback) {
        try {
            console.log('trig', call.request);
            const data = call.request;
            const response = await this.adminService.resetPasswordVerifyOTP(data);
            console.log(response, 'response from controller');
            callback(null, response);
        }
        catch (error) {
            callback(error);
        }
    }
    test(_call, callback) {
        callback(null, { success: true });
    }
}
exports.AdminController = AdminController;

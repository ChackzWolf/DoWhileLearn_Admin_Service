"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Admin_services_1 = require("../Services/Admin.services");
const Kafka_config_1 = require("../Configs/Kafka.configs/Kafka.config");
const adminService = new Admin_services_1.AdminService();
class AdminController {
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
        }
    }
    // checking order  success or fail
    async handleMessage(message) {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('START', paymentEvent, 'MESAGe haaha');
            await adminService.handleOrderSuccess(paymentEvent);
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async handleRollback(message) {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '');
            console.log('START Role back', paymentEvent, 'MESAGe haaha');
            await adminService.handleOrderTransactionFail(paymentEvent.data);
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async Login(call, callback) {
        try {
            console.log('trigerererere');
            const data = call.request;
            const response = await adminService.adminLogin(data);
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
            const response = await adminService.resetPassword(data);
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
            const response = await adminService.sendEmailOtp(data);
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
            const response = await adminService.resendEmailOtp(data);
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
            const response = await adminService.resetPasswordVerifyOTP(data);
            console.log(response, 'response from controller');
            callback(null, response);
        }
        catch (error) {
            callback(error);
        }
    }
}
exports.AdminController = AdminController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async Login(call, callback) {
        try {
            const response = await this.adminService.adminLogin(call.request);
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    async resetPassword(call, callback) {
        try {
            const response = await this.adminService.resetPassword(call.request);
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    async sendOtpToEmail(call, callback) {
        try {
            const response = await this.adminService.sendEmailOtp(call.request);
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    async resendOtpToEmail(call, callback) {
        try {
            const response = await this.adminService.resendEmailOtp(call.request);
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    async VerifyEnteredOTP(call, callback) {
        try {
            const response = await this.adminService.resetPasswordVerifyOTP(call.request);
            callback(null, response);
        }
        catch (err) {
            callback(err);
        }
    }
    test(_call, callback) {
        callback(null, { success: true });
    }
}
exports.AdminController = AdminController;

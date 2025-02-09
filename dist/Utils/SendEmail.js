"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendVerificationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ENV_configs_1 = require("../Configs/ENV_configs/ENV.configs");
const SendVerificationMail = async (email, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: ENV_configs_1.configs.DWL_EMAIL,
                pass: ENV_configs_1.configs.DWL_PASSWORD
            },
        });
        console.log('mail');
        const mailOptions = {
            from: 'DoWhileLearn <dowhilelearn@gmail.com>',
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Hello totor, Please enter the code:${otp}  to verify your email address.</p>`
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error(`Failed to send verification email: ${error}`);
    }
};
exports.SendVerificationMail = SendVerificationMail;

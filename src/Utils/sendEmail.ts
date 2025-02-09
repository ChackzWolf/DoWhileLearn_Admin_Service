import nodemailer from "nodemailer"
import { configs } from "../Configs/ENV_configs/ENV.configs";


export const SendVerificationMail = async (email: string, otp: string): Promise<void> => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  configs.DWL_EMAIL,
                pass: configs.DWL_PASSWORD
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
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error}`);
    }
};

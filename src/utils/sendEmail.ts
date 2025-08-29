import nodemailer, { SendMailOptions } from "nodemailer"
import { configs } from "../configs/ENV_configs/ENV.configs";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configs.DWL_EMAIL,
        pass: configs.DWL_PASSWORD
    },
});

export const SendVerificationMail = async (email: string, otp: string): Promise<void> => {
    try {


        console.log('mail');

        const mailOptions: SendMailOptions  = {
            from: `DoWhileLearn ${configs.DWL_EMAIL}`,
            to: email,
            subject: 'E-Mail Verification',
            html: `<p>Hello totor, Please enter the code:${otp}  to verify your email address.</p>`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send verification email: ${error}`);
    }
};

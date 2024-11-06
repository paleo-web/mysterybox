import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerficationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
    email: string,
    username: string,
    VerifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Email Verification",
            react: VerificationEmail({ username, otp: VerifyCode }),
        })
            
        return{
            success: true,
            message: "Verification email sent successfully",
        }
    } catch (EmailError) {
        console.error('Failed to send verification email',EmailError)
        return {
            success: false,
            message: "Failed to send verification email",
        }
    }
}
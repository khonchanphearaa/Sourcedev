import { randomInt } from "crypto";

interface EmailOptions {
    email: string;
    subject: string;
    otp: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

    if (!BREVO_API_KEY || !SENDER_EMAIL) {
        throw new Error("Missing Brevo configuration in environment variables.");
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: "Sourcedev",
                    email: SENDER_EMAIL,
                },
                to: [{ email: options.email }],
                subject: options.subject,
                htmlContent: generateEmailTemplate(options.otp),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Brevo API Error:", JSON.stringify(errorData));
            throw new Error(`Email delivery failed: ${response.statusText}`);
        }

        console.log(`OTP sent successfully to ${options.email}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("SEND_EMAIL_ERROR:", errorMessage);
        throw new Error("Could not send verification email.");
    }
};

const generateEmailTemplate = (otp: string): string => `
  <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee;">
    <h2>Password Reset</h2>
    <p>Your OTP code is:</p>
    <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
    <p>This code expires in 5 minutes.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 0.8rem; color: #888;">Developed @khonchanphearaa</p>
  </div>
`;
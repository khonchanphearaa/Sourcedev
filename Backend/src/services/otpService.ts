import { User } from "../models/User"
import { sendEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/generateOTP";

export const sendOTP = async (email: string) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new Error('User not found');
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes
    await user.save();

    // Generate otp via email
    await sendEmail({
        email: user.email,
        subject: 'Your OTP Code',
        otp,
    })
}

export const verifyOTP = async (email: string, otp: string) =>{
    const user = await User.findOne({
        email: email.toLowerCase(),
        otp: otp,
        otpExpires: { $gt: new Date() } 
    })
    if (!user){
        throw new Error("Invalid or expired OTP");
    }
    return user;
}

export const resetPwd = async (email: string, otp: string, newPassword: string) =>{
    const user = await verifyOTP(email, otp);

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return user;
}


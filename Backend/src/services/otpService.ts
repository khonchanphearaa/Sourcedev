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

// export const vertifyOTP = async (email: string, otp: string) =>{
//     const 
// }


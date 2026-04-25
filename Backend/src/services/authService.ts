
import crypto from 'crypto';
import { User } from "../models/User";
import generateToken from "../utils/generateToken";
import { sendEmail } from "../utils/sendEmail";

export const registerAccount = async (userData: any) => {
    // Implement registration logic here
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
        name, email, password, verificationToken, verificationExpires,
        isVerified: false
    });

    const url = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}`;
    let verificationEmailSent = true;

    try {
        await sendEmail({ email: user.email, subject: "Verify Account", verificationUrl: url });
    } catch (error) {
        verificationEmailSent = false;
        console.error('REGISTER_EMAIL_SEND_FAILED:', error);
    }

    return { user, verificationEmailSent };
};


export const loginAccount = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    const compare = user && await user.comparePassword(password);
    if (!user || !compare) {
        throw new Error("Invalid email or password");
    }
    const token = generateToken(user._id.toString());
    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
    };

    return { user: userResponse, token };
}

export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

export const updateProfile = async (userId: string, updateData: any) => {
    return await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password')
}

export const getAllUsers = async () => {
    return await User.find().select('-password').sort({ createdAt: -1 });
}

export const updateUserRole = async (id: string, role: string) => {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const verifyEmailLink = async (token: string) => {
    const user = await User.findOne({ verificationToken: token });

    if (user?.isVerified) throw new Error('Email already verified');
    if (!user) throw new Error('Invalid or expired token');
    
    if (!user.verificationExpires || user.verificationExpires <= new Date()) {
        throw new Error('Invalid or expired token');
    }

    user.isVerified = true;
    await user.save();
    return true;
}

export const resendVerificationService = async (email: string) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('Email already verified');

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); //60min or 1h

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Send the new link
    const url = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}`;
    await sendEmail({
        email: user.email,
        subject: "New Verification Link",
        verificationUrl: url
    });

    return true;
}
import { Request, Response } from 'express';
import { sendResponse } from '../utils/response';
import { ResetPasswordSchema } from '../validators/auth.validator';

import * as otpService from '../services/otpService';

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body
        if (!email) {
            return sendResponse(res, 400, 'Please provide email');
        }
        await otpService.sendOTP(email);
        return sendResponse(res, 200, 'OTP sent to your email');
        
    } catch (error) {
        return sendResponse(res, 500, 'Server error');
    }
}

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body
        if(!email || !otp) {
            return sendResponse(res, 400, 'Please provide email and OTP');
        }
        await otpService.verifyOTP(email, otp);
        return sendResponse(res, 200, 'OTP verified success');
    } catch (error) {
        return sendResponse(res, 500, 'Server error');
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> =>{
    try {
        const validation = ResetPasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return sendResponse(res, 400, validation.error.issues[0]?.message || 'Invalid request data');
        }

        const {email, otp, newPassword} = validation.data;
        await otpService.resetPwd(email, otp, newPassword);

        return sendResponse(res, 200, 'Password reset success');
    } catch (error) {
        return sendResponse(res, 500, 'Server error');
    }
}
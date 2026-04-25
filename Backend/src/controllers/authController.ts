import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendResponse } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { verificationEmailSent } = await authService.registerAccount(req.body);

    if (!verificationEmailSent) {
      return sendResponse(
        res,
        201,
        'Registration successful, but verification email could not be sent right now. Please authorize your server IP in Brevo and use resend verification.'
      );
    }

    return sendResponse(res, 201, 'Registration successful. Please check your email to verify your account.');
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, 'Please provide email and password');
    }

    const { user, token } = await authService.loginAccount(email, password);

    return sendResponse(res, 200, 'Login success', { token, user });
  } catch (error: any) {
    const status = error.message.includes('verify') ? 403 : 401;
    return sendResponse(res, status, error.message);
  }
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.user?.id as string);
    return sendResponse(res, 200, 'Profile retrieved', user);
  } catch (error: any) {
    return sendResponse(res, 404, error.message);
  }
};

export const updateProfile = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const user = await authService.updateProfile(req.user?.id as string, req.body);
    return sendResponse(res, 200, 'Profile updated', user);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};


/* Admin: get all users */
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.getAllUsers();
    return sendResponse(res, 200, 'Users retrieved', users);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};


/* Admin: update role users */
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return sendResponse(res, 400, 'Invalid role');
    }

    const user = await authService.updateUserRole(req.params.id as string, role);
    return sendResponse(res, 200, 'Role updated', user);
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    await authService.verifyEmailLink(token as string);
    return sendResponse(res, 200, 'Email verified successfully');
  } catch (error: any) {
    return sendResponse(res, 400, error.message);
  }
}

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(res, 400, 'Please provide email');
    }
    await authService.resendVerificationService(email);
    return sendResponse(res, 200, 'Verification email resent');
  } catch (error: any) {
    return sendResponse(res, 500, error.message);
  }
}
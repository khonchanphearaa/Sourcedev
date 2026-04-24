import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import * as authService from '../services/authService';
import { sendResponse } from '../utils/response';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all fields' });
      return;
    }
    const { user, token } = await authService.registerAccount(req.body);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const { user, token } = await authService.loginAccount(email, password);
    return sendResponse(res, 200, 'Login successful', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


/* Admin: update role users */
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role' });
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
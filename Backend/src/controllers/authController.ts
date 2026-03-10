import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    /* The first registered user is promoted to admin */
    const adminCount = await User.countDocuments({ role: 'admin' });
    const role = adminCount === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id.toString());
    res.status(201).json({
      success: true,
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
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar, role: user.role },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
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
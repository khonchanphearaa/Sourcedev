import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/article.routes';
import commentRoutes from './routes/comments.routes';
import otpRoutes from './routes/otp.route';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter';
const PORT = process.env.PORT;
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());

/**
 * Quick Note on Proxies:
 * If you are deploying to Vercel or using a proxy like Nginx, 
 * you must add this line to your [index.ts] so that Express knows 
 * to trust the IP address passed by the proxy
 */
app.set('trust proxy', 1);

// Routes
app.use('/api', apiLimiter);

app.use('/api/auth',authLimiter, authRoutes);
app.use('/api/otp', authLimiter, otpRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Sourcedev API is running' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sourcedev API running on http://localhost:${PORT}`);
  });
});

export default app;